import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from "@angular/router";

import { AppComponent } from './app.component';
import { LandingComponent } from './landing/landing.component';
import { SignInComponent } from './landing/sign-in/sign-in.component';
import { SignUpComponent } from './landing/sign-up/sign-up.component';


const appRoutes: Routes =
[
  { path: 'signin', component: SignInComponent },
  { path: 'signup', component: SignUpComponent }
  
]

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    SignInComponent,
    SignUpComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
