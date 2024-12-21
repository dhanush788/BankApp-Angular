import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-create-account',
  standalone: true, 
  imports: [ ReactiveFormsModule, CommonModule ],
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css']
})
export class CreateAccountComponent {
  userForm: FormGroup;
  isFormSubmitted: boolean = false;

  constructor(private http: HttpClient) { // Inject HttpClient
    this.userForm = new FormGroup({
      uid: new FormControl(localStorage.getItem('userProfile') ? JSON.parse(localStorage.getItem('userProfile')!).uid : ''),
      account_number: new FormControl("", [Validators.required]),
      interest_rate: new FormControl("", [Validators.required]),
      tenure: new FormControl("", [Validators.required]),
      emi_due: new FormControl("", [Validators.required]),
    });
  }

  onSubmit() {
    const isFormValid = this.userForm.valid;
    this.isFormSubmitted = true;
    if (isFormValid) {
      this.http.post('http://localhost:3000/users/', this.userForm.value)
        .subscribe(
          response => {
            console.log('User created:', response);
          },
          error => {
            console.error('Error creating user:', error);
          }
        );
    }
    console.log(this.userForm.value);
  }
}
