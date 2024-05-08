import { Component } from '@angular/core';
import { Category } from '../../models/category.model';
import { Column, TableComponent } from '../../components/table/table.component';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [TableComponent],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent {


  constructor(private apiService: ApiService) { }

  columns: Array<Column> = [
    {
      columnDef: 'id', header: 'ID', cell: (element:
        Record<string, any>) => `${element['id']}`
    },{
      columnDef: 'name', header: 'Nombre', cell: (element:
        Record<string, any>) => `${element['name']}`
    },
    {
      columnDef: 'description', header: 'Descripción', cell: (element:
        Record<string, any>) => `${element['description']}`
    }
  ]
}
