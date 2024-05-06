import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Component } from '@angular/core';
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

  constructor(private apiService: ApiService) { }

  connect(collectionViewer: CollectionViewer): Observable<readonly any[]> {
    return this.objectSubject.asObservable();
  }
  disconnect(collectionViewer: CollectionViewer): void {
    this.objectSubject.complete();
    this.loadingSubject.complete();
  }

  load(model: string, filter = '', sortDirection = 'asc', page = 0, offset = 3){
    this.loadingSubject.next(true);
    this.apiService.get(model, filter, sortDirection, page, offset)
    .pipe(catchError(() => of([])), 
    finalize(() => this.loadingSubject.next(false)))
    .subscribe(data => {
      this.objectSubject.next(data);
      console.log(data)
    })
  }
}
