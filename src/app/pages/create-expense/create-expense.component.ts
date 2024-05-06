import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatInput, MatFormField } from '@angular/material/input';
import { MatLabel, MatOption, MatSelect } from '@angular/material/select';
import { ApiService } from '../../services/api.service';
import { AsyncPipe, NgFor } from '@angular/common';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { provideNativeDateAdapter } from '@angular/material/core';
import { formatDate } from '@angular/common';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { Observable, map, startWith } from 'rxjs';

@Component({
  selector: 'app-create-expense',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    MatButton, MatInput, MatFormField, MatSelect, MatLabel, MatOption, NgFor, 
    ReactiveFormsModule, MatInputModule, MatDatepickerModule, MatAutocompleteModule, AsyncPipe
  ],
  templateUrl: './create-expense.component.html',
  styleUrl: './create-expense.component.css'
})
export class CreateExpenseComponent implements OnInit{

  createForm: FormGroup;

  myControl = new FormControl('');
  options: string[] = [];
  filteredOptions!: Observable<string[]>;

  constructor(private fb: FormBuilder, private apiService: ApiService, private _snackBar: MatSnackBar) {
    this.createForm = this.fb.group({
      date: ['date', [Validators.required]],
      description: ['description', [Validators.required]],
      quantity: ['quantity', [Validators.required, Validators.min(1)]],
      category: ['category', [Validators.required]],
    });
    this.apiService.get('categorias', '','',0,0).subscribe(data => {
      this.options = data
      console.log(data)
    })
   }


  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

   hasErrors(controlName:string, errorType:string) {
    return this.createForm.get(controlName)?.hasError(errorType) && this.createForm.get(controlName)?.touched
   }

   onSubmit(){
    this.createForm.get('date')?.setValue(formatDate(this.createForm.get('date')?.value, 'YYYY-MM-dd', 'en-US'))
    console.log(this.createForm.get('date')?.value)
    if (this.createForm.valid) {
      this.apiService.createExpense(this.createForm.value).subscribe(data => {
        console.log(data)
      })
    } else {
      console.table(this.createForm.value);
      this._snackBar.open('Por favor, rellena todos los campos', 'Cerrar');
    }
  }
  
}
