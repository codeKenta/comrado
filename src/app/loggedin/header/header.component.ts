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

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    $(".link").click( function(){
      $("#extended-account-menu").slideUp();
    })

    $(".user-thumb").click( function(){
      $("#extended-account-menu").slideToggle();
    })
  }

  onSignOutClick() {
    this.authService.signOut();
    this.router.navigate(['/signin']);
    return false;
  }

}
