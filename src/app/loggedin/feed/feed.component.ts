import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NgClass } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { FriendsService } from '../../services/friends.service';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent implements OnInit {

  currentUserId: string;
  filter: any[];
  matchedFriends: any;

  constructor(
    private authService: AuthService,
    private friendsService: FriendsService,
  ) {

    this.currentUserId = this.authService.getUser().id;
    this.filter = this.authService.getUser().filter;
    this.matchFriends();

    // Listening for changes in the user object in the service
    this.authService.userUpdated.subscribe((user) => {
        this.filter = this.authService.getUser().filter;
      });

   }

  ngOnInit() {

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

    }, err => {
      console.log(err);
      return false;
    });

  }

  matchFriends(){
    this.friendsService.matchFriends(this.currentUserId, this.filter).subscribe(friends => {
      this.matchedFriends = friends;
      return true;
    }, err => {
      console.log(err);
      return false;
    });
  }



}
