import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

declare var $:any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  user: Object = {
    username: '',
    imagepath: '',
    friendRequests: [],
    friends: []
  }

  constructor(
    private authService: AuthService,
    private router: Router,
  ) { }

  ngOnInit() {

    this.authService.getProfile().subscribe(profile => {
      this.user = profile.user;
    },
    err => {
      console.log(err);
      return false;
    });

    $(".link").click( function(){
      $("#extended-account-menu").slideUp();
    });

    $(".user-thumb").click( function(){
      $("#extended-account-menu").slideToggle();
    });

  }


  onSignOutClick() {
    this.authService.signOut();
    this.router.navigate(['/']);
    return false;
  }

}
