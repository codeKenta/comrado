import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from "@angular/router";

import { AngularFontAwesomeModule } from 'angular-font-awesome';

import { AppComponent } from './app.component';
import { LandingComponent } from './landing/landing.component';
import { SignInComponent } from './landing/sign-in/sign-in.component';
import { SignUpComponent } from './landing/sign-up/sign-up.component';

import { HeaderComponent } from './loggedin/header/header.component';
import { FeedComponent } from './loggedin/feed/feed.component';
import { FriendsComponent } from './loggedin/friends/friends.component';

import { EatComponent } from './icons/eat/eat.component';
import { DrinkComponent } from './icons/drink/drink.component';
import { CoffeeComponent } from './icons/coffee/coffee.component';
import { GameComponent } from './icons/game/game.component';
import { SearchComponent } from './icons/search/search.component';

const appRoutes: Routes =
[
  { path: 'signin', component: SignInComponent },
  { path: 'signup', component: SignUpComponent },
  { path: 'feed', component: FeedComponent },
  { path: 'friends', component: FriendsComponent }
]

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    SignInComponent,
    SignUpComponent,
    HeaderComponent,
    FeedComponent,
    EatComponent,
    DrinkComponent,
    CoffeeComponent,
    GameComponent,
    FriendsComponent,
    SearchComponent
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
