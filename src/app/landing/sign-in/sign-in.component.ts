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
    console.log('submited sign in');
    var user = {
      username: this.username,
      password: this.password
    }

    if(!this.validateService.validateUserDetails(user)){
      this.flashMessages.show('Please fill the form', {cssClass: 'alert-error', timeout: 5000});
      return false;
    }

    this.authService.authenticateUser(user).subscribe(data => {
      if(data.success) {
        this.username = '';
        this.password = '';
        this.authService.storeUserData(data.token, data.user);
        this.router.navigate(['/feed']);

      } else {
        this.flashMessages.show(data.msg, { cssClass: 'alert-error', timeout: 5000 });
        this.username = '';
        this.password = '';
      }
    });
  }

}
