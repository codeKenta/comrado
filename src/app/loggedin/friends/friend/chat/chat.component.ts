import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { AuthService } from '../../../../services/auth.service';
import { ChatService } from '../../../../services/chat.service';
import { SocketService } from '../../../../services/socket.service';
import { Observable, Subject } from 'rxjs/Rx';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnChanges {

  currentUser: any;
  message: string;
  conversation: any;
  @Input() friend: any;
  chatSocket: Subject<any>;

  constructor(
    private authService: AuthService,
    private chatService: ChatService,
    private socketService: SocketService,
  ) {

    this.currentUser = this.authService.getUser();

    this.chatSocket = <Subject<any>>socketService
      .connectChat()
      .map((response: any): any => {
        return response;
      })

   }

  ngOnInit() {

    /*
    Sending introducing data for the user to the server-socket.
    So the socket can keep track of connected users.
    */
    this.socketService.introduceChat(this.currentUser.id);

    /*
    Listen for call that inform this client to update the conversation
    */
    this.chatSocket.subscribe(sender => {
      this.getConversation();
    });

  }

  ngOnChanges() {
    this.getConversation();
  }


  sendMessage(){
    this.chatService.sendMessage(this.currentUser.id, this.friend._id, this.message).
    subscribe(result => {

      this.message = "";
      this.getConversation();

      let data = {
        reciever: this.friend._id
      }
      this.chatService.sendMessageSocket(data);
      return true;
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
      return true;
    }, err => {
      console.log(err);
      return false;
    });
  }
}
