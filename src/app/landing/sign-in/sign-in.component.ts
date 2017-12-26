import { Component, OnInit } from '@angular/core';
import { ValidateService } from '../../services/validate.service';
import { AuthService } from '../../services/auth.service';
import { FriendsService } from '../../services/friends.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements OnInit {
  username: String;
  password: String;
  usernames: any;
  isLoading: boolean = false;

  constructor(
    private validateService: ValidateService,
    private authService: AuthService,
    private friendsService: FriendsService,
    private flashMessages: FlashMessagesService,
    private router: Router
  ) {

  }



  ngOnInit() {
  }


  onSignInSubmit(){
    this.isLoading = true;
    var user = {
      username: this.username,
      password: this.password
    }

    if(!this.validateService.validateUserDetails(user)){
      this.isLoading = false;
      this.flashMessages.show('Please fill the form', {cssClass: 'alert-error', timeout: 5000});
      return false;
    }

    // First tries to login, if the user not exist then the user is beeing registered.
    this.authService.authenticateUser(user).subscribe(data => {

      if(data.success) {
        // If existing user signed in successful
        this.resetFormFields();
        this.authService.storeUserData(data.token, data.user);
        this.isLoading = false;
        this.router.navigate(['/feed']);

      } else {

        // If not, a new user is registered
        this.authService.registerUser(user).subscribe(data => {
          if(data.success){

            this.authService.authenticateUser(user).subscribe(data => {

              if(data.success) {
                // If existing user signed in successful

                this.resetFormFields();
                this.authService.storeUserData(data.token, data.user);
                this.isLoading = false;
                this.router.navigate(['/feed']);

              } else {
                // If the registration was not successful
                this.isLoading = false;
                this.resetFormFields();
                this.flashMessages.show(data.msg, {cssClass: 'alert-error', timeout: 5000});
                }
            });

          } else {
            // If the login was not successful
            this.isLoading = false;
            this.resetFormFields();
            this.flashMessages.show('Wrong password', {cssClass: 'alert-error', timeout: 5000});
          }

        });
      }
    });

  }

  resetFormFields() {
    this.username = '';
    this.password = '';
  }

}
