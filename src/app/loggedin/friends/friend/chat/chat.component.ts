import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../../../../services/auth.service';
import { ChatService } from '../../../../services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  currentUser: any;
  message: string;
  conversation: any;
  @Input() friend: any;

  constructor(
    private authService: AuthService,
    private chatService: ChatService
  ) {
    console.log("hellllo???");
    console.log(this.friend);
    this.currentUser = this.authService.getUser();
    this.getConversation();
   }

  ngOnInit() {

  }

  sendMessage(){

    this.chatService.sendMessage(this.currentUser.id, this.friend._id, this.message).
    subscribe(result => {
      console.log(result);
      this.message = "";
    }, err => {
      console.log(err);
      return false;
    });
  }

  // Gets the conversation between friend and current user
  getConversation(){
    let user1 = this.currentUser.id;
    let user2 = this.friend._id;

    this.chatService.getConversation(user1, user2).subscribe(foundConversation => {
      this.conversation = foundConversation;
    }, err => {
      console.log(err);
      return false;
    });
  }
}
