import { Injectable } from '@angular/core';
import { Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class AccountService {

  constructor(private http:Http) { }

  // https://nehalist.io/uploading-files-in-angular2/

  updatePassword(userId, oldPassword, newPassword){

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    let inputData = {
      userId: userId,
      oldPassword: oldPassword,
      newPassword: newPassword
    }

    return this.http.post('users/updatepassword', inputData, { headers: headers })
      .map(res => res.json());
   }

}
