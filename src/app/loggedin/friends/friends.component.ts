import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.scss']
})
export class FriendsComponent implements OnInit {

  extendedMenu = false;

  constructor() { }

  ngOnInit() {
  }

  toggleExtendedMenu(){
    this.extendedMenu = !this.extendedMenu;
  }

}
