import { Component, OnInit, OnChanges } from "@angular/core";
import { ChatService } from "../services/chat.service";
import { Observable } from "rxjs";
import { ChatMessage } from "../models/chat-message.model";
import { NgOnChangesFeature } from "@angular/core/src/render3";
import { AngularFireList } from "angularfire2/database";

@Component({
  selector: "app-feed",
  templateUrl: "./feed.component.html",
  styleUrls: ["./feed.component.css"]
})
export class FeedComponent implements OnInit {
  feed: Observable<ChatMessage[]>;

  constructor(private chat: ChatService) {}

  ngOnInit() {
    this.feed = this.chat.getMessages().valueChanges();
  }

  ngOnChanges() {
    this.feed = this.chat.getMessages().valueChanges();
  }
}
