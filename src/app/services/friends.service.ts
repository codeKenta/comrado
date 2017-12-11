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

  showUsers(currentUserId) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get('users', currentUserId, { headers: headers })
      .map(res => res.json());
  }

  sendRequest() {

  }

  acceptRequest() {

  }

  removeFriend() {

  }

}
