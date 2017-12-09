import { Injectable } from '@angular/core';
import { Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class FriendsService {

  constructor(private http:Http) { }

  filterMyFriends() {

  }

  myFriends() {

  }

  showUsers() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('users/register', user, { headers: headers })
      .map(res => res.json());
  }

  sendRequest() {

  }

  acceptRequest() {

  }

  removeFriend() {

  }

}
