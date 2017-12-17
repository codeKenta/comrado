import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { AccountService } from '../../services/account.service';
import { FlashMessagesService } from 'angular2-flash-messages';


@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

user: any;
oldPassword: string;
newPassword: string;

  constructor(
    private authService: AuthService,
    private AccountService: AccountService,
    private flashMessages: FlashMessagesService,
  ) {
    this.user = this.authService.getUser();
  }

  ngOnInit() {
  }

  updatePassword(){
    this.AccountService.updatePassword(this.user.id, this.oldPassword, this.newPassword).subscribe(result => {
      this.oldPassword = "";
      this.newPassword = "";
      this.flashMessages.show('Password successfully uppdated', {cssClass: 'alert-success', timeout: 5000});
    }, err =>{
      console.log(err);
    });
  }
}
