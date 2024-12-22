import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

interface UserData {
  id: number;
  issue_date: string;
  account_number: string;
  interest_rate: number;
  tenure: number;
  loan_amount: number;
  months_to_repay: number;
}

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

@Component({
  selector: 'app-disply-details',
  imports: [CommonModule],
  templateUrl: './disply-details.component.html',
  styleUrls: ['./disply-details.component.css']
})
export class DisplyDetailsComponent implements OnInit {
  userData: UserData | null = null;
  paymentData: PaymentData[] | null = null;
  monthlyPayment: boolean = false;

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {
    const userProfile = localStorage.getItem('userProfile');
    if (userProfile) {
      const { uid } = JSON.parse(userProfile);
      if (uid) {
        this.getUserData(uid);
        this.getPaymentData(uid);
      }
    }
  }


  getUserData(uid: string) {
    this.http.get<UserData>(`${environment.apiUrl}/users/${uid}`).subscribe(data => {
      if (!data.id) {
        console.log("No user data found");
        this.router.navigate([`new`]);
      } else {
        data.issue_date = this.formatDate(data.issue_date);
        this.userData = data;
      }
    });
  }
  

  getPaymentData(uid: string) {
    this.http.get<PaymentData[]>(`${environment.apiUrl}/payments/${uid}`).subscribe(data => {
      this.paymentData = data;
      const currentMonth = new Date().getMonth();
      this.monthlyPayment = !data.some(payment => new Date(payment.payment_date).getMonth() === currentMonth);
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  }

  navigateToPayment(paymentId: number) {
    this.router.navigate([`payment/${paymentId}`]);
  }

  navigateToAddPayment(){
    this.router.navigate([`addpayment`]);
  }
}
