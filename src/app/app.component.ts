import { Component } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { environment } from '../environments/environment';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet , CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'navTask';
  isLoggedIn = false;
  userProfile: any;
  userProfilePicture: string | null = null;
  userName: string | null = null;

  constructor() {
    initializeApp(environment.firebase);
  }

  login() {
    console.log("working");

    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    console.log("working");

    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        console.log('User signed in:', user);
        this.isLoggedIn = true;
        this.userProfile = user;
        this.userProfilePicture = user.photoURL;
        this.userName = user.displayName;
      })
      .catch((error) => {
        console.error('Error during sign-in:', error);
      });
  }

  showProfile() {
    console.log('User Profile:', this.userProfile);
    console.log('User Profile Picture:', this.userProfilePicture);
    console.log('User Name:', this.userName);
  }
}
