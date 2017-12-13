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
    let params: URLSearchParams = new URLSearchParams();
    params.set('currentUserId', currentUserId );

    return this.http.get('users', { search: params })
      .map(res => res.json());
  }

  sendRequest(requesterId, recieverId) {
    let inputData = {
      requesterId: requesterId,
      recieverId: recieverId
    }

    return this.http.put('users/request', inputData)
      .map(res => res.json());
  }

  acceptRequest() {

  }

  removeFriend() {

  }

}
