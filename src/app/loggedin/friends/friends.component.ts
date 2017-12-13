import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FriendsService } from '../../services/friends.service';


@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.scss']
})
export class FriendsComponent implements OnInit {
  // user: Object = {
  //   _id: '',
  //   username: '',
  //   imagepath: '',
  //   friendRequests: [],
  //   friends: []
  // };

  // user: object;

  // users: any[];


  constructor(
    private router: Router,
    private authService: AuthService,
    private friendsService: FriendsService,
  ) {

    // this.authService.getProfile().subscribe(profile => {

    //   this.friendsService.getUsers(profile.user._id).subscribe(users => {
    //     this.users = users;
    //     console.log(this.users);
    //
    //   }, err => {
    //     console.log(err);
    //     return false;
    //   });
    // },
    // err => {
    //   console.log(err);
    //   return false;
    // });

   }

  ngOnInit() {



  }

}
