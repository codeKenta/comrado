import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

declare var $:any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  constructor(
    private authService: AuthService,
    private router: Router
  ){
    
    if(this.authService.isSignedIn()){
      this.router.navigate(['/feed']);
    }
  }



}
