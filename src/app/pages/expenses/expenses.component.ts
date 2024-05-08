import { Component } from '@angular/core';
import { Expense } from '../../models/expense.model';
import { ApiService } from '../../services/api.service';
import { Column, Action, TableComponent } from '../../components/table/table.component';
import { TotalComponent } from '../../components/total/total.component';
import { ModifyExpenseComponent } from './modify-expense/modify-expense.component';
import {
  MatDialog,
} from '@angular/material/dialog';
import { AlertService } from '../../services/alert.service';


@Component({
  selector: 'app-expenses',
  standalone: true,
  imports: [TableComponent, TotalComponent],
  templateUrl: './expenses.component.html',
  styleUrl: './expenses.component.css'
})
export class ExpensesComponent{

  total: number = 0;

  constructor(private apiService: ApiService, public dialog: MatDialog, public alertService: AlertService) {
    this.apiService.getTotalExpenses().subscribe(data => {
      this.total = data; 
    })
  }

  delete($event:number){
    this.apiService.delete('expenses', $event).subscribe(data => {
      console.log(data)
      //TODO: alertService
    })
  }

  openDialog($e:Expense){
    const dialogRef = this.dialog.open(ModifyExpenseComponent, {
      data: $e,
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result)

      if (typeof result == "undefined") {
        return;
      }
      
      this.apiService.updateExpense(result).subscribe(data => {
        console.log(data)
        let message = data === true ? 'Modificado correctamente' : 'No se ha podido modificar';

        this.alertService.logError(message);
      })
    });
  }

  columns: Array<Column> = [
    {
      columnDef: 'id', header: 'ID', cell: (element:
        Record<string, any>) => `${element['id']}`
    },
    {
      columnDef: 'date', header: 'Fecha', cell: (element:
        Record<string, any>) => `${element['date']}`
    },
    {
      columnDef: 'description', header: 'Descripción', cell: (element:
        Record<string, any>) => `${element['description']}`
    },
    {
      columnDef: 'quantity', header: 'Importe', cell: (element:
        Record<string, any>) => `${element['quantity']}`
    },
    {
      columnDef: 'category', header: 'Categoría', cell: (element:
        Record<string, any>) => `${element['category']}`
    },
    {
      columnDef: 'actions', header: 'Acciones', cell: (element:
        Record<string, any>) => `${element['category']}`
      }
  ];
  actions: Array<Action> = [
    {
      columnDef: 'modify', name: 'Modificar', color: ''
    },
    {
      columnDef: 'delete', name: 'Eliminar', color: 'warn'
    }
  ];

}
