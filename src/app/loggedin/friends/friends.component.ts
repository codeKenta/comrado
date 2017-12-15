import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FriendsService } from '../../services/friends.service';


@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.scss']
})
export class FriendsComponent implements OnInit {
  currentUser: any;
  requests: any[];
  friends: any[];
  search: string;


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private friendsService: FriendsService
  ) {

    // get data for current logged in user
    this.currentUser = this.authService.getUser();
    
    // Get details about friends if there is any
    if(this.currentUser.friends.length !== 0) {
      this.getUsersByIds(this.currentUser.friends, 'friends');
    }

    // Get details about requesters if there is any
    if(this.currentUser.friendRequests.length !== 0) {
      this.getUsersByIds(this.currentUser.friendRequests, 'requests');
    }

    this.route.queryParams.subscribe((params)=>{
        if(params['reload'] == '1') {
          // Reloads the friends if there have been a change to friends-list in other component
          // like when removing friend and then beein redirected here
          this.friendsService.getUserById(this.currentUser.id).subscribe(updatedUser => {

            // Updates current user information
            this.currentUser = updatedUser;
            this.authService.setUser(updatedUser);

            // loads new list of friends from the updated current user data
            this.getUsersByIds(this.currentUser.friends, 'friends');
          }, err => {
            console.log(err);
            return false;
          });

        }
      });


   }

  ngOnInit() {

    console.log("FRIENDS COMPONENT", this.currentUser);

  }

  acceptRequest(requesterId){
    // removes the request and making friendship relationship between booth users
    this.friendsService.acceptRequest(requesterId, this.currentUser.id).subscribe(result => {

      // Updates user information with new friend
      this.friendsService.getUserById(this.currentUser.id).subscribe(updatedUser => {

        // updates the user information
        this.currentUser = updatedUser;
        // also storing the updated user in the service so
        // other components can reach the new data
        this.authService.setUser(updatedUser);

        // Finally the friends-array is being updated
        this.getUsersByIds(this.currentUser.friends, 'friends');

      }, err => {
        console.log(err);
        return false;
      });


      }, err => {
        console.log(err);
        return false;
      });
  }

  denyRequest(requesterId){
    // removes the request from the curren user
    this.friendsService.denyRequest(requesterId, this.currentUser.id).subscribe(result => {

      // Updates user information with new list of request
      this.friendsService.getUserById(this.currentUser.id).subscribe(updatedUser => {

          // updates the user information
          this.currentUser = updatedUser;
          // also storing the updated user in the service so
          // other components can reach the new data
          this.authService.setUser(updatedUser);

          // Finally the request-array is being updated
          this.getUsersByIds(this.currentUser.friendRequests, 'requests');

        }, err => {
          console.log(err);
          return false;
        });

      }, err => {
        console.log(err);
        return false;
    });


  }


  // Dynamic function which can be used to update both requests- and friends-array
  // storageVariable-parameter is the string-name of the variable where result
  // will be stored outside this function
  getUsersByIds(arrayOfIds, storageVariable){
    this.friendsService.getUsersByIds(arrayOfIds).
    subscribe(result => {
      this[storageVariable] = result;
      return true;
    }, err => {
      console.log(err);
      return false;
    });
  }


}
