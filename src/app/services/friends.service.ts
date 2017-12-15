import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class FriendsService {

  constructor(private http:Http) { }


  setMyFilter(currentUser, filter) {
    let inputData = {
      currentUserId: currentUser,
      filter: filter
    }

    return this.http.put('users/setfilter', inputData)
      .map(res => res.json());
  }


  filterMyFriends(currentUser, filter) {
    let inputData = {
      currentUserId: currentUser,
      filter: filter
    }

    return this.http.post('users/match', inputData)
      .map(res => res.json());
  }

  // Gets a list of all users except of the current user
  getUsers(currentUserId) {
    let params: URLSearchParams = new URLSearchParams();
    params.set('currentUserId', currentUserId );

    return this.http.get('users', { search: params })
      .map(res => res.json());
  }

  // Gets a list of users that matches an array of user ids
  getUsersByIds(userIds) {
    return this.http.post('users/ids', userIds)
      .map(res => res.json());
  }

  // Get one user by id
  getUserById(userId){
    return this.http.get('users/id/' + userId)
      .map(res => res.json());
  }

  // Get one user by id
  getUserByUsername(username){

    return this.http.get('users/username/' + username)
      .map(res => res.json());
  }

  // Sends a friend request
  sendRequest(requesterId, recieverId) {
    let inputData = {
      requesterId: requesterId,
      recieverId: recieverId
    }

    return this.http.put('users/request', inputData)
      .map(res => res.json());
  }

  // Accepts friend request
  acceptRequest(requesterId, accepterId) {
    let inputData = {
      requesterId: requesterId,
      accepterId: accepterId
    }

    return this.http.put('users/request/accept', inputData)
      .map(res => res.json());

  }

  // Denies friend request
  denyRequest(requesterId, denierId) {
    let inputData = {
      requesterId: requesterId,
      denierId: denierId
    }

    return this.http.put('users/request/deny', inputData)
      .map(res => res.json());

  }

  // ends friendship between two friends
  endFriendship(currentUserId, friendId) {
    let inputData = {
      currentUserId: currentUserId,
      friendId: friendId
    }

    return this.http.put('users/endfriendship', inputData)
      .map(res => res.json());

  }



}
