import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Expense } from '../../../models/expense.model';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';

//TODO: categories

@Component({
  selector: 'app-modify-expense',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
  ],
  templateUrl: './modify-expense.component.html',
  styleUrl: './modify-expense.component.css'
})
export class ModifyExpenseComponent {
  constructor(
    public dialogRef: MatDialogRef<ModifyExpenseComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Expense,
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
