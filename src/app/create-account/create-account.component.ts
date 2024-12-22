import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-create-account',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css']
})
export class CreateAccountComponent implements OnInit {
  userForm: FormGroup;
  isFormSubmitted: boolean = false;
  isCalculating: boolean = false;
  monthsToRepay: number | null = null;

  constructor(private http: HttpClient, private router: Router) {
    this.userForm = new FormGroup({
      uid: new FormControl(localStorage.getItem('userProfile') ? JSON.parse(localStorage.getItem('userProfile')!).uid : ''),
      account_number: new FormControl("", [Validators.required]),
      interest_rate: new FormControl("", [Validators.required]),
      tenure: new FormControl("", [Validators.required]),
      emi_due: new FormControl("", [Validators.required]),
      loan_amount: new FormControl("", [Validators.required]),
      months_to_repay: new FormControl("", [Validators.min(0)])

    });
  }

  ngOnInit(): void {
    this.userForm.valueChanges.subscribe((values) => {
      if (values.loan_amount || values.interest_rate || values.tenure || values.emi_due) {
        this.calculateMonthsToRepay();
      }
    });
  }

  calculateMonthsToRepay() {
    const loanAmount = this.userForm.get('loan_amount')?.value;
    const interestRate = this.userForm.get('interest_rate')?.value / 100; 
    const emiDue = this.userForm.get('emi_due')?.value;
  
    if (loanAmount && emiDue) {
      if (interestRate === 0) {
        this.monthsToRepay = Math.ceil(loanAmount / emiDue);
      } else {
        const monthlyInterestRate = interestRate / 12;
        const numerator = Math.log(emiDue / (emiDue - loanAmount * monthlyInterestRate));
        const denominator = Math.log(1 + monthlyInterestRate);
        this.monthsToRepay = Math.ceil(numerator / denominator); 
      }
    } else {
      this.monthsToRepay = null;
    }
  }
  
  

  onSubmit() {
    const isFormValid = this.userForm.valid;
    this.isFormSubmitted = true;
    this.userForm.get('months_to_repay')?.setValue(this.monthsToRepay);
    if (isFormValid) {
      console.log(this.userForm.value)
      this.http.post(`${environment.apiUrl}/users/`, this.userForm.value)
        .subscribe(
          response => {
            console.log('User created:', response);
            this.router.navigate(['/dashboard']);
          },
          error => {
            console.error('Error creating user:', error);
          }
        );
    }
  }
}
