import { Component, OnInit } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent implements OnInit {
  // filter = {
  //   eat: true,
  //   drink: true,
  //   coffee: false,
  //   game: false
  // }

  filter = [
    'eat',
    'drink',
  ];

  constructor() { }

  ngOnInit() {

    console.log(this.filter.includes('eat'));
  }

  setFilter(filterItem) {

    if( this.filter.includes(filterItem) ){
      console.log("Avaktivera");
      let index = this.filter.indexOf(filterItem);
      this.filter.splice(index, 1);
    } else {
      console.log("Aktivera");
      this.filter.push(filterItem);
    }
    console.log(this.filter)
// Send

    // this.filter[filter] = !this.filter[filter];
  }



}
