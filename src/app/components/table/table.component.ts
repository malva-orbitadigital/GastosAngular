import { Component, Input, Output, EventEmitter, OnChanges, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { CustomDataSourceComponent } from '../custom-data-source/custom-data-source.component';
import { CommonModule } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { ApiService } from '../../services/api.service';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MatPaginator } from '@angular/material/paginator';
import { debounceTime, distinctUntilChanged, fromEvent, merge, tap } from 'rxjs';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';

export interface Column {
  columnDef: string;
  header: string;
  cell: Function;
}

export interface Action {
  columnDef: string;
  name: string;
  color: string;
}

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    CommonModule, MatTableModule, MatButton, MatProgressSpinnerModule, 
    MatPaginator, MatSortModule, MatInputModule
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent<T> implements OnChanges, AfterViewInit {
  @Input() data: Array<T> = [];
  @Input() columns: Array<Column> = []; 
  @Input() actions?: Array<Action>;
  @Input() model: string = '';
  @Input() numRows: number = 0;

  @Output() delete = new EventEmitter<number>();
  @Output() modify = new EventEmitter<any>();
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('input') input!: ElementRef;

  dataSource: CustomDataSourceComponent = new CustomDataSourceComponent(this.apiService);
  displayedColumns: Array<string> = [];

  constructor(private apiService: ApiService){}

  ngOnChanges(): void {
    this.dataSource = new CustomDataSourceComponent(this.apiService);
    this.displayedColumns = this.columns.map(column => column.columnDef);
    this.dataSource.load(this.model);
  }

  ngAfterViewInit(){
    fromEvent(this.input.nativeElement,'keyup')
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
            this.paginator.pageIndex = 0;
            this.loadPage();
        })
      )
      .subscribe();

    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
      
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => this.loadPage())
      )
      .subscribe();
  }

  loadPage(){
    this.dataSource.load(
      this.model,
      this.input.nativeElement.value,
      this.sort.direction,
      this.paginator.pageIndex,
      this.paginator.pageSize
    )
  }

  onDelete(elem:any){
    this.delete.emit(elem.id);
  }

  onModify(elem:any){
    this.modify.emit(elem);
  }


}
