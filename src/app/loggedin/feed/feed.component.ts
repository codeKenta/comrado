import { Component, OnInit } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent implements OnInit {
  activities = {
    eat: true,
    drink: true,
    coffee: false,
    game: false
  }
  constructor() { }

  ngOnInit() {
  }

  toggleActivity(activity) {
    this.activities[activity] = !this.activities[activity];
  }

}
