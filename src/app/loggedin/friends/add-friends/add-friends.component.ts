import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FriendsService } from '../../../services/friends.service';
import { AuthService } from '../../../services/auth.service';

declare var $:any;

@Component({
  selector: 'app-add-friends',
  templateUrl: './add-friends.component.html',
  styleUrls: ['./add-friends.component.scss']
})
export class AddFriendsComponent implements OnInit {

  // currentUser
  currentUser: any;
  users: any[];
  search: string;

  constructor(
    private router: Router,
    private authService: AuthService,
    private friendsService: FriendsService
  ) {
    this.currentUser = this.authService.getUser();

    this.friendsService.getUsers(this.currentUser.id).subscribe(users => {
      this.users = users;

    }, err => {
      console.log(err);
      return false;
    });
  }

  ngOnInit() {
    $('#friends-link').addClass('active');
  }

  sendRequest(recieverId){
    this.friendsService.sendRequest(this.currentUser.id, recieverId).subscribe(result => {

      this.friendsService.getUsers(this.currentUser.id).subscribe(users => {
        this.users = users;

      }, err => {
        console.log(err);
        return false;
      });

    }, err => {
      console.log(err);
      return false;
    });

  }


}
