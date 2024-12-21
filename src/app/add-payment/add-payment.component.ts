import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface PaymentResponse {
  payment_id: string;
}

@Component({
  selector: 'app-add-payment',
  standalone: true, 
  imports: [CommonModule, ReactiveFormsModule], 
  templateUrl: './add-payment.component.html',
  styleUrls: ['./add-payment.component.css']
})
export class AddPaymentComponent implements OnInit {
  userForm: FormGroup;
  isFormSubmitted: boolean = false;

  constructor(private formBuilder: FormBuilder, private http: HttpClient, private router: Router) {
    const userProfile = localStorage.getItem('userProfile');
    const userId = userProfile ? JSON.parse(userProfile).uid : '';

    this.userForm = this.formBuilder.group({
      customer_id: [userId, Validators.required], // Ensure 'customer_id' is required
      payment_amount: ['', [Validators.required, Validators.min(1)]],
      status: ["SUCCESS"]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    this.isFormSubmitted = true;

    if (this.userForm.valid) {
      this.http.post<PaymentResponse>('http://localhost:3000/payments/', this.userForm.value)
        .subscribe(
          (response) => {
            console.log('Payment submitted successfully', response);
            const paymentId = response.payment_id;
            this.router.navigate([`/payment/${paymentId}`]); 
            this.userForm.reset(); 
            this.isFormSubmitted = false; 
          },
          (error) => {
            console.error('Error submitting payment', error);
            alert('Failed to submit payment. Please try again.');
          }
        );
    }
  }
}
