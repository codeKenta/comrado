import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from "@angular/router";

import { AppComponent } from './app.component';
import { LandingComponent } from './landing/landing.component';
import { SignInComponent } from './landing/sign-in/sign-in.component';
import { SignUpComponent } from './landing/sign-up/sign-up.component';
import { LoggedInComponent } from './logged-in/logged-in.component';
import { FeedComponent } from './logged-in/feed/feed.component';

import { AngularFontAwesomeModule } from 'angular-font-awesome';

const appRoutes: Routes =
[
  { path: 'signin', component: SignInComponent },
  { path: 'signup', component: SignUpComponent },
]

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    SignInComponent,
    SignUpComponent,
    LoggedInComponent,
    FeedComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    AngularFontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
