import { Component, OnInit } from '@angular/core';
import { ValidateService } from '../../services/validate.service';
import { AuthService } from '../../services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
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

  onSignUpSubmit(){

    var user = {
      username: this.username,
      password: this.password
    }

    if(!this.validateService.validateUserDetails(user)){
      this.flashMessages.show('Please fill the form', {cssClass: 'alert-error', timeout: 5000});
      return false;
    }

    // Register the user

    this.authService.registerUser(user).subscribe(data => {
      if(data.success){

        this.username = '';
        this.password = '';

        this.flashMessages.show('New user registered', {cssClass: 'alert-success', timeout: 5000});
        this.router.navigate(['/signup']);
      } else {

        this.username = '';
        this.password = '';

        this.flashMessages.show('Something went wrong. Please try again.', {cssClass: 'alert-error', timeout: 5000});
        this.router.navigate(['/signup']);
      }

    });
  }



}
