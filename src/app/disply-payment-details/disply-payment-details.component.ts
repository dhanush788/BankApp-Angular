import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../environments/environment';
import { jsPDF } from 'jspdf'
import { Router } from '@angular/router';

interface PaymentData {
  customer_id: string;
  id: number;
  payment_amount: number;
  payment_date: string;
  status: string;
  payment_method: string;
  tax_amount: number;
  grand_total: number;
}

interface UserData {
  id: number;
  issue_date: string;
  account_number: string;
  interest_rate: number;
  tenure: number;
  loan_amount: number;
  months_to_repay: number;
}

@Component({
  selector: 'app-disply-payment-details',
  imports: [CommonModule],
  templateUrl: './disply-payment-details.component.html',
  styleUrl: './disply-payment-details.component.css'
})
export class DisplyPaymentDetailsComponent implements OnInit {
  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) { }
  paymentData: PaymentData | null = null;
  isLoading: boolean = false;
  userData: UserData | null = null;

  ngOnInit() {
    const uid = localStorage.getItem('userProfile') ? JSON.parse(localStorage.getItem('userProfile')!).uid : ''
    this.isLoading = true;
    this.route.params.subscribe(params => {
      const dynamicId = params['id'];
      this.getPaymentData(uid, dynamicId)
      this.getUserData(uid);
    });
  }

  getUserData(uid: string) {
    this.http.get<UserData>(`${environment.apiUrl}/users/${uid}`).subscribe(data => {
      if (data.id) {
        data.issue_date = this.formatDate(data.issue_date);
        this.userData = data;
      }
    });
  }

  getPaymentData(uid: string, dynamicId: string) {
    this.http.get<PaymentData[]>(`${environment.apiUrl}/payments/${uid}`).subscribe(data => {
      this.paymentData = data.find(payment => payment.id.toString() === dynamicId) || null;
      this.isLoading = false;
      console.log(this.paymentData)
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  }


  exportToPDF() {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Payment Details', 10, 10);

    if (this.paymentData && this.userData) {
      const details = [
        `Amount: ${this.paymentData.payment_amount}`,
        `Status: ${this.paymentData.status}`,
        `Account Number: ${this.userData.account_number}`,
        `Payment Method: ${this.paymentData.payment_method}`,
        `Date: ${this.paymentData.payment_date}`,
        `Tax Amount: ${this.paymentData.tax_amount}`,
        `Grand Total: ${this.paymentData.grand_total}`,
        `Interest Rate: ${this.userData.interest_rate}%`
      ];

      details.forEach((line, index) => {
        doc.text(line, 10, 20 + (index * 10));
      });
    }

    doc.save('payment-details.pdf');
  }

  goHome() {
    this.router.navigate(['/']);
  }

}
