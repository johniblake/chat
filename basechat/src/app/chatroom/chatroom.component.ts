import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewChecked
} from "@angular/core";

import { AuthService } from "../services/auth.service";
import { Observable } from "rxjs";
import { Router } from "@angular/router";
import { AngularFireAuth } from "angularfire2/auth";

@Component({
  selector: "app-chatroom",
  templateUrl: "./chatroom.component.html",
  styleUrls: ["./chatroom.component.css"]
})
export class ChatroomComponent implements OnInit, AfterViewChecked {
  @ViewChild("scroller")
  private feedContainer: ElementRef;
  user: Observable<firebase.User>;
  userEmail: any;

  constructor(private authService: AuthService, private router: Router) {
    this.user = this.authService.authUser();
    console.log("CHATROOM USER: " + this.user);
    this.user = this.authService.authUser();
    this.user.subscribe(user => {
      if (!user) {
        this.router.navigate(["login"]);
      }
    });
  }

  ngOnInit() {}

  scrollToBottom(): void {
    this.feedContainer.nativeElement.scrollTop = this.feedContainer.nativeElement.scrollHeight;
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }
}
