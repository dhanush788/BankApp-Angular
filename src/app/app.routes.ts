import { Routes } from '@angular/router';
import { FormComponent } from './form/form.component';
import { CreateAccountComponent } from './create-account/create-account.component';
import { DisplyPaymentDetailsComponent } from './disply-payment-details/disply-payment-details.component';
import { DisplyDetailsComponent } from './disply-details/disply-details.component';

export const routes: Routes = [
    {
        path: 'new',
        component: CreateAccountComponent
    },
    {
        path: 'reactiveFormValidation',
        component: FormComponent
    },
    {
        path: 'success',
        component: DisplyPaymentDetailsComponent
    },
    {
        path:'dashboard',
        component: DisplyDetailsComponent
    }

];