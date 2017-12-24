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
  user: any;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {

    // authenticate and gets the user data
    this.authService.getProfile().subscribe(profile => {
      this.user = profile.user;
    },
    err => {
      console.log(err);
      return false;
    });

    // Listening for changes in the user object in the service
    this.authService.userUpdated.subscribe((user) => {
        this.user = this.authService.getUser();
        console.log("user loaded");
      }
    );



   }

  ngOnInit() {

    console.log("this USer", this.user);
    $(".link, #accountLink").click( function(){
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
