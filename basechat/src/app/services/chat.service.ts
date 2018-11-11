import { Injectable } from "@angular/core";
import { AngularFireDatabase, AngularFireList } from "angularfire2/database";
import { AngularFireAuth } from "angularfire2/auth";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { AuthService } from "../services/auth.service";
import * as firebase from "firebase/app";

import { ChatMessage } from "../models/chat-message.model";

@Injectable({
  providedIn: "root"
})
export class ChatService {
  user: firebase.User;
  usersRef: AngularFireList<firebase.User>;
  chatMessagesRef: AngularFireList<ChatMessage>;
  chatMessages: Observable<ChatMessage[]>;
  chatMessage: ChatMessage;
  userName: any;

  constructor(
    private db: AngularFireDatabase,
    private afAuth: AngularFireAuth
  ) {
    this.chatMessagesRef = db.list("messages");
    this.chatMessages = this.db.list("messages").valueChanges();
    this.afAuth.authState.subscribe(auth => {
      if (auth !== undefined && auth !== null) {
        this.user = auth;
      }
      this.getUser().subscribe(item => {
        // getting displayName property of user
        this.userName = item[0];
      });
    });
  }

  getUser() {
    const userId = this.user.uid;
    return this.db.list("users", ref => ref.child(userId)).valueChanges();
  }

  getUsers() {
    return this.db.list("users").valueChanges();
  }

  sendMessage(msg: string) {
    const timestamp = this.getTimestamp();
    const email = this.user.email;
    this.chatMessagesRef = this.getMessages();

    this.chatMessagesRef.push({
      message: msg,
      timeSent: timestamp,
      userName: this.userName,
      email: email
    });
    console.log("Called sendMessage()!");
  }

  getMessages(): AngularFireList<ChatMessage> {
    // query to create our message feed binding
    return this.db.list("messages", ref => ref.limitToLast(25).orderByKey());
  }

  getTimestamp() {
    const now = new Date();
    const date =
      now.getUTCFullYear() +
      "/" +
      (now.getUTCMonth() + 1) +
      "/" +
      now.getUTCDate();
    const time =
      now.getUTCHours() + ":" + now.getUTCMinutes() + ":" + now.getUTCSeconds();
    return date + " " + time;
  }
}
