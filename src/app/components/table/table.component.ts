import { Component, Input, Output, EventEmitter, OnChanges, ViewChild, AfterViewInit, ElementRef, SimpleChanges, OnInit, afterRender, ChangeDetectorRef, HostListener } from '@angular/core';
import { CustomDataSourceComponent } from '../custom-data-source/custom-data-source.component';
import { CommonModule } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { ApiService } from '../../services/api.service';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MatPaginator } from '@angular/material/paginator';
import { debounceTime, distinctUntilChanged, fromEvent, merge, min, tap } from 'rxjs';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';


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

const CELL_SIZE = 50;


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
  @Input() columns: Array<Column> = []; 
  @Input() actions?: Array<Action>;
  @Input() model: string = '';
  
  @Output() delete = new EventEmitter<number>();
  @Output() modify = new EventEmitter<any>();
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('input') input!: ElementRef;
  
  dataSource: CustomDataSourceComponent = new CustomDataSourceComponent(this.apiService);
  displayedColumns: Array<string> = [];
  screenHeight: number = 0;
  initRows: number = 0;
  
  constructor(private apiService: ApiService, private cd: ChangeDetectorRef, @Inject(PLATFORM_ID) private platformId: Object){
    if (isPlatformBrowser(this.platformId)) {
      this.screenHeight = window.innerHeight;
    }
  }
  
  
  ngOnChanges(changes: SimpleChanges): void {    
    this.dataSource = new CustomDataSourceComponent(this.apiService);
    this.displayedColumns = this.columns.map(column => column.columnDef);
    
    this.initRows = Math.floor((this.screenHeight-300) / CELL_SIZE);
    this.loadPage();
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
    var filter = '';
    var pageIndex = 0;
    var sortField = 'id';
    var pageSize = this.initRows;
    var direction = 'DESC';
    
    if(typeof this.input != 'undefined'){
      filter = this.input.nativeElement.value;
    }
    
    if(typeof this.paginator != 'undefined'){
      pageIndex = this.paginator.pageIndex;
      pageSize = this.paginator.pageSize;
    }
    
    if(typeof this.sort != 'undefined'){
      direction = this.sort.direction;
      sortField = this.sort.active;
    }

    this.dataSource.load(
      this.model,
      filter,
      sortField,
      direction,
      pageIndex,
      pageSize
    )
  }

  onDelete(elem:any){
    this.delete.emit(elem.id);
  }

  onModify(elem:any){
    this.modify.emit(elem);
  }


}
