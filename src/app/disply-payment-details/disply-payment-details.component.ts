import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../environments/environment';

interface PaymentData {
  customer_id: string;
  id: number;
  payment_amount: number;
  payment_date: string;
  status: string;
}

@Component({
  selector: 'app-disply-payment-details',
  imports: [CommonModule],
  templateUrl: './disply-payment-details.component.html',
  styleUrl: './disply-payment-details.component.css'
})
export class DisplyPaymentDetailsComponent implements OnInit {
  constructor(private route: ActivatedRoute, private http: HttpClient) { }
  paymentData: PaymentData | null = null;
  isLoading: boolean = false;

  ngOnInit() {
    const uid = localStorage.getItem('userProfile') ? JSON.parse(localStorage.getItem('userProfile')!).uid : ''
    this.isLoading = true;
    this.route.params.subscribe(params => {
      const dynamicId = params['id'];
      this.getPaymentData(uid, dynamicId)
    });
  }

  getPaymentData(uid: string, dynamicId: string) {
    this.http.get<PaymentData[]>(`${environment.apiUrl}/payments/${uid}`).subscribe(data => {
      this.paymentData = data.find(payment => payment.id.toString() === dynamicId) || null;
      this.isLoading = false;
    });
  }
}
