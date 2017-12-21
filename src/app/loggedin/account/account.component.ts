import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { AccountService } from '../../services/account.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { FileUploader, FileItem, ParsedResponseHeaders } from 'ng2-file-upload';

declare var $:any;


@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})


export class AccountComponent implements OnInit {
  sendFileUrl: string;
  user: any;
  oldPassword: string;
  newPassword: string;

  // public uploader : FileUploader = new FileUploader(
  //   { url: this.sendFileUrl
  //   });
  public uploader : FileUploader;
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
    this.sendFileUrl = 'users/upload/' + this.user.id + '/' + this.user.username;

    this.uploader = new FileUploader(
      { url: this.sendFileUrl,
        headers: [{name:'Accept', value:'application/json'}],
        autoUpload: true
      });
      this.uploader.onErrorItem = (item, response, status, headers) => this.onErrorItem(item, response, status, headers);
      this.uploader.onSuccessItem = (item, response, status, headers) => this.onSuccessItem(item, response, status, headers);
  }

    onSuccessItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): any {
        let data = JSON.parse(response); //success server response
        console.log(data);
    }

    onErrorItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): any {
        let error = JSON.parse(response); //error server response
        console.log(error);
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
