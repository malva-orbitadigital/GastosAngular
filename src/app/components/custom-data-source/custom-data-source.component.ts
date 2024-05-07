import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { BehaviorSubject, Observable, catchError, finalize, of } from 'rxjs';

interface Parameters {
  model: string;
  filter: string;
  sortDirection: string;
  offset: number;
}

@Component({
  selector: 'app-custom-data-source',
  standalone: true,
  imports: [],
  templateUrl: './custom-data-source.component.html',
  styleUrl: './custom-data-source.component.css'
})
export class CustomDataSourceComponent implements DataSource<any> {
  // TODO intentarlo mas adelante con una "lista"

  private objectSubject = new BehaviorSubject<any[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

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

  load(model: string, filter = '', sortDirection = 'asc', page = 0, offset = 3){
    if (this.pages.has(page)) {
      let savedPage = this.pages.get(page)!;
      if (model === savedPage.model && filter === savedPage.filter && sortDirection === savedPage.sortDirection && offset === savedPage.offset) {
        this.objectSubject.next(this.dataPages.get(page)!);
        console.log("pzsidjc")
        return;
      } else {
        this.pages.delete(page);
        this.dataPages.delete(page);
      }      
    }
    
    this.loadingSubject.next(true);
    this.apiService.get(model, filter, sortDirection, page, offset)
    .pipe(catchError(() => of([])), 
    finalize(() => this.loadingSubject.next(false)))
    .subscribe(data => {
      this.objectSubject.next(data);
      console.log(data)

      this.dataPages.set(page, data);
      this.pages.set(page, {model, filter, sortDirection, offset});

      // TODO data: [data: T; total_register: number;] = [data: [], total_register: 0]
    })
  }
}
