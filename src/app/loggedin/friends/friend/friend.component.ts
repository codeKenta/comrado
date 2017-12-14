import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { FriendsService } from '../../../services/friends.service';

declare var $:any;

@Component({
  selector: 'app-friend',
  templateUrl: './friend.component.html',
  styleUrls: ['./friend.component.scss']
})
export class FriendComponent implements OnInit {
  currentUser: any;
  friend = {
    username: ''
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private friendsService: FriendsService
  ) {
    // gets data for the friend
    this.getUserData(this.route.snapshot.params['username'], 'friend');

    // get data for current logged in user
    this.currentUser = this.authService.getUser();
  }

  ngOnInit() {

    $('#friends-link').addClass('active');

    $(".extended-menu-friend-btn").click( function(){
      $("#extended-account-menu").slideUp();
    });

    $(".extended-menu-friend-btn").click( function(){
      $("#extended-menu-friend").slideToggle();
    });

  }

  // Dynamic function for getting userdata fro one user by username.
  // storageVariable-parameter is the string-name of the variable where result
  // will be stored outside this function
  getUserData(username, storageVariable){
    this.friendsService.getUserByUsername(username).
    subscribe(result => {
      this[storageVariable] = result;
      return true;
    }, err => {
      console.log(err);
      return false;
    });
  }

  removeFriend(friendId){
    console.log("THE CURRENT USER ID ----> ", this.currentUser.id)
    this.friendsService.endFriendship(this.currentUser.id, friendId).
    subscribe(result => {
      this.router.navigate(['/friends'], { queryParams: { reload: '1' } });
      return true;
    }, err => {
      console.log(err);
      return false;
    });

  }

}
