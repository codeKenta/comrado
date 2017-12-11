import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class FriendsService {

  constructor(private http:Http) { }

  filterMyFriends() {

  }

  myFriends() {

  }

  // Gets a list of all users except of the current user
  getUsers(currentUserId) {
    let headers = new Headers();
    let params: URLSearchParams = new URLSearchParams();
    params.set('currentUserId', currentUserId );

    headers.append('Content-Type', 'application/json');
    return this.http.get('users', { headers: headers,  search: params })
      .map(res => res.json());
  }

  sendRequest() {
    alert("SEND REQUEST FRIENDI")

  }

  acceptRequest() {

  }

  removeFriend() {

  }

}
