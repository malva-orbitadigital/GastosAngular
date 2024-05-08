import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Component, HostListener, Input, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { BehaviorSubject, Observable, catchError, finalize, of } from 'rxjs';

@Component({
  selector: 'app-custom-data-source',
  standalone: true,
  imports: [],
  templateUrl: './custom-data-source.component.html',
  styleUrl: './custom-data-source.component.css'
})
export class CustomDataSourceComponent implements DataSource<any> {
  private objectSubject = new BehaviorSubject<any[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();
  
  public numRows: number = 0;

  private pages = new Map<number, {model: string, filter: string, sortDirection: string, offset: number}>();
  private dataPages = new Map<number, any[]>()
  
  
  constructor(private apiService: ApiService) { }
 
  connect(collectionViewer: CollectionViewer): Observable<readonly any[]> {
    return this.objectSubject.asObservable();
  }
  disconnect(collectionViewer: CollectionViewer): void {
    this.objectSubject.complete();
    this.loadingSubject.complete();
  }

  load(model: string, filter = '', sortField = 'id', sortDirection = 'asc', page = 0, offset = 3){
    if (this.pages.has(page)) {
      let savedPage = this.pages.get(page)!;
      if (model === savedPage.model && filter === savedPage.filter && sortDirection === savedPage.sortDirection && offset === savedPage.offset) {
        this.objectSubject.next(this.dataPages.get(page)!);
        return;
      }

      this.pages.delete(page);
      this.dataPages.delete(page);
    }
    
    this.loadingSubject.next(true);
    this.apiService.getData(model, filter, sortField, sortDirection, page, offset)
    .pipe(catchError(() => of([])), 
    finalize(() => this.loadingSubject.next(false)))
    .subscribe(data => {
      this.objectSubject.next(data[1]);
      this.numRows = data[0];

      console.log(data[0])

      this.dataPages.set(page, data[1]);
      this.pages.set(page, {model, filter, sortDirection, offset});

      // TODO data: [data: T; total_register: number;] = [data: [], total_register: 0]
    })
  }
}
