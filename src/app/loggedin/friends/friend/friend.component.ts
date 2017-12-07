import { Component, OnInit } from '@angular/core';

declare var $:any;

@Component({
  selector: 'app-friend',
  templateUrl: './friend.component.html',
  styleUrls: ['./friend.component.scss']
})
export class FriendComponent implements OnInit {

  constructor() {}

  ngOnInit() {
    $('#friends-link').addClass('active');
  }

}
