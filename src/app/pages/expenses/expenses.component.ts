import { Component } from '@angular/core';
import { Expense } from '../../models/expense.model';
import { ApiService } from '../../services/api.service';
import { Column, Action, TableComponent } from '../../components/table/table.component';
import { TotalComponent } from '../../components/total/total.component';
import { ModifyExpenseComponent } from './modify-expense/modify-expense.component';
import {
  MatDialog,
} from '@angular/material/dialog';

export interface DialogData {
  id: string
  date: string;
  description: string;
  quantity: number;
  category: string;
}


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

  constructor(private apiService: ApiService, public dialog: MatDialog) {
    this.apiService.getTotalExpenses().subscribe(data => {
      this.total = data;
    })
    this.apiService.get('gastos','','',0,0).subscribe(data => {
      this.expenses = data;
    })
    this.apiService.getNum('gastos').subscribe(data => {
      this.totalRows = data;
    })
  }


  delete($event:number){
    this.apiService.delete('gastos', $event).subscribe(data => {
      this.apiService.get('gastos','','',0,0).subscribe(data => {
        this.expenses = data;
      })
    })
  }

  openDialog($e:any){
    const dialogRef = this.dialog.open(ModifyExpenseComponent, {
      data: {id:$e.id, date: $e.fecha, description: $e.descripcion, quantity: $e.importe, category: $e.categoria},
    });
    //TODO
    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
      this.apiService.updateExpense(result).subscribe(data => {
        console.log(data)
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
        Record<string, any>) => `${element['fecha']}`
    },
    {
      columnDef: 'description', header: 'Descripción', cell: (element:
        Record<string, any>) => `${element['descripcion']}`
    },
    {
      columnDef: 'quantity', header: 'Importe', cell: (element:
        Record<string, any>) => `${element['importe']}`
    },
    {
      columnDef: 'category', header: 'Categoría', cell: (element:
        Record<string, any>) => `${element['categoria']}`
    },
    {
      columnDef: 'actions', header: 'Acciones', cell: (element:
        Record<string, any>) => `${element['categoria']}`
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
