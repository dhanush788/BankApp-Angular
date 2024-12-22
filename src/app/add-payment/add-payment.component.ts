import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface PaymentResponse {
  payment_id: string;
  payment_method: string;
  tax_amount: number;
  grand_total: number;
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
      payment_method: ['', [Validators.required]],
      tax_amount: ['',[Validators.required]],
      grand_total: ['',[Validators.required]],
      status: ["SUCCESS"]
    });
  }

  ngOnInit(): void {
    this.userForm.get('payment_amount')?.valueChanges.subscribe(paymentAmount => {
      const parsedAmount = parseFloat(paymentAmount); 
      const taxRate = 0.1;
      const taxAmount = parsedAmount ? parsedAmount * taxRate : 0;
      const grandTotal = parsedAmount ? parsedAmount + taxAmount : 0;

      // Update the form values
      this.userForm.patchValue({
        tax_amount: taxAmount,
        grand_total: grandTotal
      }, { emitEvent: false }); 
    });
  }

  onSubmit(): void {
    this.isFormSubmitted = true;

    if (this.userForm.valid) {
      const paymentAmount = parseFloat(this.userForm.value.payment_amount);
      const taxRate = 0.1;
      const taxAmount = paymentAmount * taxRate;
      const grandTotal = paymentAmount + taxAmount;

      // Update the form values
      this.userForm.patchValue({
        tax_amount: taxAmount,
        grand_total: grandTotal
      });

      // Log the values to check if they are being set correctly
      console.log('Tax Amount:', taxAmount);
      console.log('Grand Total:', grandTotal);

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
