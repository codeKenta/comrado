import { Component, OnInit } from '@angular/core';
import { ValidateService } from '../../services/validate.service';
import { AuthService } from '../../services/auth.service';
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

  constructor(
    private validateService: ValidateService,
    private authService: AuthService,
    private flashMessages: FlashMessagesService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  onSignInSubmit(){

    var user = {
      username: this.username,
      password: this.password
    }

    if(!this.validateService.validateUserDetails(user)){
      this.flashMessages.show('Please fill the form', {cssClass: 'alert-error', timeout: 5000});
      return false;
    }

    // First tries to login, if the user not exist then the user is beeing registered.
    this.authService.authenticateUser(user).subscribe(data => {

      if(data.success) {
        console.log('user exist');
        // If existing user signed in successful
        this.resetFormFields();
        this.authService.storeUserData(data.token, data.user);
        this.router.navigate(['/feed']);

      } else {
        console.log('new user');
        // If not, a new user is registered
        this.authService.registerUser(user).subscribe(data => {
          if(data.success){

          } else {

            // If the registration was not successful
            this.resetFormFields();
            this.flashMessages.show('Something went wrong. Please try again.', {cssClass: 'alert-error', timeout: 5000});
            this.router.navigate(['']);
          }

        });
      }
    });

    // Second signin-attemp with new user
    this.authService.authenticateUser(user).subscribe(data => {

      if(data.success) {
        console.log('user exist');
        // If existing user signed in successful
        this.resetFormFields();
        this.authService.storeUserData(data.token, data.user);
        this.router.navigate(['/feed']);

      } else {
        // If the registration was not successful
        this.resetFormFields();
        this.flashMessages.show(data.msg, {cssClass: 'alert-error', timeout: 5000});
        this.router.navigate(['']);

        }
    });
  }

  resetFormFields() {
    this.username = '';
    this.password = '';
  }

}
