import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AngularFontAwesomeModule } from 'angular-font-awesome';

import { AppComponent }     from './app.component';
import { LandingComponent } from './landing/landing.component';
import { SignInComponent }  from './landing/sign-in/sign-in.component';
import { SignUpComponent }  from './landing/sign-up/sign-up.component';

import { EatComponent }     from './icons/eat/eat.component';
import { DrinkComponent }   from './icons/drink/drink.component';
import { CoffeeComponent }  from './icons/coffee/coffee.component';
import { GameComponent }    from './icons/game/game.component';
import { SearchComponent }  from './icons/search/search.component';

import { HeaderComponent }      from './loggedin/header/header.component';
import { FeedComponent }        from './loggedin/feed/feed.component';
import { FriendsComponent }     from './loggedin/friends/friends.component';
import { AddFriendsComponent }  from './loggedin/friends/add-friends/add-friends.component';
import { FriendComponent }      from './loggedin/friends/friend/friend.component';
import { ChatComponent }        from './loggedin/friends/friend/chat/chat.component';

import { ValidateService } from './services/validate.service';
import { AuthService } from './services/auth.service';


import { FlashMessagesModule } from 'angular2-flash-messages';



const appRoutes: Routes =
[
  {
    path: 'signin',
    component: SignInComponent
  },
  {
    path: 'signup',
    component: SignUpComponent
  },
  {
    path: 'feed',
    component: FeedComponent
  },
  {
    path: 'friends',
    component: FriendsComponent
  },
  {
    path: 'addfriends',
    component: AddFriendsComponent
  },

  {
    path: 'friend/:friend',
    component: FriendComponent
  }
];


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
    SearchComponent,
    AddFriendsComponent,
    FriendComponent,
    ChatComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    AngularFontAwesomeModule,
    FormsModule,
    HttpModule,
    FlashMessagesModule.forRoot()
  ],
  providers: [
    ValidateService,
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
