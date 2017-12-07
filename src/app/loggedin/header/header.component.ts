import { Component, OnInit } from '@angular/core';

declare var $:any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    $(".link").click( function(){
      $("#extended-account-menu").slideUp();
    })

    $(".user-thumb").click( function(){
      $("#extended-account-menu").slideToggle();
    })
  }

}
