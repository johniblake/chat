import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { AngularFireAuth } from "angularfire2/auth";
import { AngularFireDatabase } from "angularfire2/database";
import * as firebase from "firebase/app";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  private user: Observable<firebase.User>;
  private authState: any;

  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFireDatabase,
    private router: Router
  ) {
    this.user = afAuth.authState;
  }

  authUser() {
    return this.user;
  }

  login(email: string, password: string) {
    return this.afAuth.auth
      .signInWithEmailAndPassword(email, password)
      .then(user => {
        this.authState = user;
        const status = "online";
        this.setUserStatus(status, this.authState);
        this.router.navigate(["chat"]);
      });
  }

  logout() {
    this.setUserStatus("offline", this.authState);
    this.afAuth.auth.signOut();
    this.router.navigate(["login"]);
  }

  get currentUserId(): string {
    return this.authState !== null ? this.authState.uid : "";
  }

  signUp(email: string, password: string, displayName: string) {
    return this.afAuth.auth
      .createUserWithEmailAndPassword(email, password)
      .then(user => {
        this.authState = user;
        const status = "online";
        this.setUserData(email, displayName, status, user);
      })
      .catch(error => console.log(error));
  }

  setUserData(
    email: string,
    displayName: string,
    status: string,
    authState: firebase.auth.UserCredential
  ): void {
    const path = "users/" + authState.user.uid;
    const data = {
      email: email,
      displayName: displayName,
      status: status
    };
    this.db
      .object(path)
      .update(data)
      .catch(error => console.log(error));
  }

  setUserStatus(status: string, authState: firebase.auth.UserCredential): void {
    const path = "users/" + authState.user.uid;
    const data = {
      status: status
    };
    console.log("PATH:" + path);
    this.db
      .object(path)
      .update(data)
      .catch(error => console.log(error));
  }
}
