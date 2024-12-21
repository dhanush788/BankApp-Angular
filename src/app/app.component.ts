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
    this.loadUserData();
  }

  login() {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        console.log('User signed in:', user);
        this.isLoggedIn = true;
        this.userProfile = user;
        this.userProfilePicture = user.photoURL;
        this.userName = user.displayName;

        localStorage.setItem('userProfile', JSON.stringify({
          uid: user.uid,
          photoURL: user.photoURL,
          displayName: user.displayName
        }));

        this.checkUserData(user.uid);
      })
      .catch((error) => {
        console.error('Error during sign-in:', error);
      });
  }

  loadUserData() {
    const userData = localStorage.getItem('userProfile');
    if (userData) {
      const user = JSON.parse(userData);
      this.isLoggedIn = true;
      this.userProfile = user;
      this.userProfilePicture = user.photoURL;
      this.userName = user.displayName;
    }
  }

  checkUserData(userId: string) {
    fetch(`http://localhost:3000/users/${userId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('User data:', data);
        if (data && Object.keys(data).length > 0) {
          console.log('Routing to user page');
        } else {
          console.log('Routing to new user page');
        }
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      });
  }

  showProfile() {
    console.log('User Profile:', this.userProfile);
    console.log('User Profile Picture:', this.userProfilePicture);
    console.log('User Name:', this.userName);
  }
}
