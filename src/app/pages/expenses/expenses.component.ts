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

  expenses: any[] = [];
  total: number = 0;
  totalRows: number = 0;

  constructor(private apiService: ApiService, public dialog: MatDialog, public alertService: AlertService) {
    this.apiService.getTotalExpenses().subscribe(data => {
      this.total = data;
    })
    this.apiService.get('expenses','','',0,0).subscribe(data => {
      this.expenses = data;
    })
    this.apiService.getNum('expenses').subscribe(data => {
      this.totalRows = data;
    })
  }

  delete($event:number){
    this.apiService.delete('expenses', $event).subscribe(data => {
      this.apiService.get('expenses','','',0,0).subscribe(data => {
        this.expenses = data;
      })
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
