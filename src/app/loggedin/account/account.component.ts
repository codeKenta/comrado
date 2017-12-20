import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { AccountService } from '../../services/account.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { FileUploader } from 'ng2-file-upload';

declare var $:any;
const URL = 'users/upload';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})


export class AccountComponent implements OnInit {

  user: any;
  oldPassword: string;
  newPassword: string;

  public uploader : FileUploader = new FileUploader(
    { url: URL
    });
  public hasBaseDropZoneOver : boolean = false;

  public fileOverBase(e:any):void {
    console.log(this.uploader);
     this.hasBaseDropZoneOver = e;
   }

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
