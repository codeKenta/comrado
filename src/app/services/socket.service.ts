import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Observable';
import * as Rx from 'rxjs/Rx';

/*
Source for foundation and some comments
https://tutorialedge.net/typescript/angular/angular-socket-io-tutorial/
*/

@Injectable()
export class SocketService {

  // Our socket connection
  private socket;

  constructor() { }


  /*
  Socket for introducing the user to the server.
  Sending user details.
  This method only needs one-way communication
  */
  introduce(data){
    this.socket.emit('introduce', JSON.stringify(data));
  }


  /*
  Socket for connection to the chat socket which is listening
  for calls that tells the client to send new request to server
  for updating the chat conversation.
  */
  connectChat(): Rx.Subject<MessageEvent> {

    this.socket = io();

    // We define our observable which will observe any incoming messages
    // from our socket.io server.
    let observable = new Observable(observer => {
        this.socket.on('chat', (data) => {
          console.log("Received message from Websocket Server", data)
          observer.next(data);
        })
        return () => {
          this.socket.disconnect();
        }
    });

    // We define our Observer which will listen to messages
    // from our other components and send messages back to our
    // socket server whenever the `next()` method is called.
    let observer = {
        next: (data: Object) => {
            this.socket.emit('chat', JSON.stringify(data));
        },
    };

    // we return our Rx.Subject which is a combination
    // of both an observer and observable.
    return Rx.Subject.create(observer, observable);
  }


  /*
  Socket for connection to the feed socket which is listening
  for calls that tells the client to send new request to server
  for updating the feed.
  */

  connectFeed(): Rx.Subject<MessageEvent> {

    this.socket = io();

    // We define our observable which will observe any incoming messages
    // from our socket.io server.
    let observable = new Observable(observer => {
        this.socket.on('feed', (data) => {
          observer.next(data);
        })
        return () => {
          this.socket.disconnect();
        }
    });

    // We define our Observer which will listen to messages
    // from our other components and send messages back to our
    // socket server whenever the `next()` method is called.
    let observer = {
        next: (data: Object) => {
            this.socket.emit('feed', JSON.stringify(data));
        },
    };

    // we return our Rx.Subject which is a combination
    // of both an observer and observable.
    return Rx.Subject.create(observer, observable);
  }

  updateFeed(data){
    this.socket.emit('feed', JSON.stringify(data));
  }

  updateConversation(data){
    this.socket.emit('chat', JSON.stringify(data));
  }

  // Method to call for disconnect the socket when logging out
  disconnect(){
    this.socket.disconnect();
  }

}
