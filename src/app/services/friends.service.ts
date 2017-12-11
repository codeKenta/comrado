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
    let params: URLSearchParams = new URLSearchParams();
    params.set('currentUserId', currentUserId );

    headers.append('Content-Type', 'application/json');
    return this.http.get('users', { headers: headers,  search: params })
      .map(res => res.json());
  }

  sendRequest() {

  }

  acceptRequest() {

  }

  removeFriend() {

  }

}
