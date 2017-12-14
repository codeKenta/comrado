import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class ChatService {

  constructor(private http:Http) { }

  sendMessage(sender, reciever, message){

    let inputData = {
      sender: sender,
      reciever: reciever,
      message: message
    }

    return this.http.post('message/send', inputData)
      .map(res => res.json());
  }

  getConversation(user1, user2){
    let inputData = {
      user1: user1,
      user2: user2
    }
    return this.http.post('message/conversation', inputData)
      .map(res => res.json());
  }

}
