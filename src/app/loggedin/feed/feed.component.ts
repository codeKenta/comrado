import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NgClass } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { FriendsService } from '../../services/friends.service';
import { SocketService } from '../../services/socket.service';
import { Observable, Subject } from 'rxjs/Rx';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent implements OnInit {

  currentUserId: string;
  filter: any[];
  matchedFriends: any;
  matchedFriendsId: any[];

  feedSocket: Subject<any>;
  introduceSocket: Subject<any>;

  constructor(
    private authService: AuthService,
    private friendsService: FriendsService,
    private socketService: SocketService
  ) {

    this.currentUserId = this.authService.getUser().id;
    this.filter = this.authService.getUser().filter;
    this.matchFriends();

    // Listening for changes in the user object in the service
    this.authService.userUpdated.subscribe((user) => {
        this.filter = this.authService.getUser().filter;
      });

    // Listening for calls on the feed-socket.
    this.feedSocket = <Subject<any>>socketService
      .connectFeed()
      .map((response: any): any => {
        return response;
    });

   }

  ngOnInit() {

    // Sending introducing data for the user to the server-socket.
    // So the socket can keep track of connected users.
    this.socketService.introduce(this.currentUserId);

    // Listening to the feedSocket that informs this client
    // to update their feed
    this.feedSocket.subscribe(msg => {
      this.matchFriends();
    });

  }

  setFilter(filterItem) {

    // Deactivate filter
    if( this.filter.includes(filterItem) ){
      let index = this.filter.indexOf(filterItem);
      this.filter.splice(index, 1);
    // Or activate filter
    } else {
      this.filter.push(filterItem);
    }

    this.friendsService.setMyFilter(this.currentUserId, this.filter).subscribe(result => {
      this.matchFriends();

    // Inform the friends to update their feed
    this.socketService.updateFeed(this.matchedFriendsId);

    }, err => {
      console.log(err);
      return false;
    });

  }

  // Matching friends by the users filter
  matchFriends(){
    this.friendsService.matchFriends(this.currentUserId, this.filter).subscribe(friends => {

      // Gets data for the friends
      this.matchedFriends = friends;

      // Restoring the array with the id's to the matched friends.
      this.matchedFriendsId = [];

      // Pushing the new matched friends into the array
      // This array is then used for communcation via sockets.
      for (var i = 0; i < friends.length; i++) {
        this.matchedFriendsId.push(friends[i]._id);
      }

      return true;
    }, err => {
      console.log(err);
      return false;
    });
  }



}
