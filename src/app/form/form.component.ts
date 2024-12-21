import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css'
})
export class FormComponent {

  userForm: FormGroup;
  isFormSubmitted: boolean = false;

  constructor() {
    this.userForm =  new FormGroup({
      firstName: new FormControl("",[Validators.required]),
      lastName: new FormControl("",[Validators.required]),
      userName:  new FormControl("",[Validators.required,Validators.email]),
      accountNo: new FormControl("" , [Validators.required]),

    })
  }

  onSubmit() {
    const isFormValid = this.userForm.valid;
    this.isFormSubmitted =  true;
  }

}