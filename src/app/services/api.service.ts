import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// import { Data } from '../components/custom-data-source/custom-data-source.component';
import { Observable, map, shareReplay } from 'rxjs';

const apiUrl = "http://localhost/ContabilidadAngular/api/apiService.php?";//cors=1&"

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  // getData(model: string, filter: string, sortDirection: string, page: number, offset: number): Observable<Data<any>> {
  //   let numRegister = 0;
  //   this.getNum(model).subscribe(value => numRegister = value).unsubscribe;
  //   let data: any[] = [];
  //   this.get(model, filter, sortDirection, page, offset).subscribe(values => data = values).unsubscribe;
  //   console.log(data)
  //   let fullData: Data<any> = {
  //     data: data,
  //     totalRegister: numRegister
  //   };
  //   return new Observable(observer => observer.next(fullData));
  // }

  get(model: string, filter: string, sortDirection: string, page: number, offset: number): Observable<any[]> {
    let where = (filter !== '') ? "&where=description LIKE '%"+filter+"%'" : '';
    return this.http.get<any[]>(apiUrl+'action=get&model='+model+where
    +'&orderHow='+sortDirection+'&page='+page+'&offset='+offset);
  }

  getNum(model: string): Observable<number> {
    return this.http.get<number>(apiUrl+'action=getNum&model='+model);
  }

  delete(model: string, id: number): Observable<string> {
    return this.http.get<string>(apiUrl+'action=delete&model='+model+'&id='+id);
  }

  getTotalExpenses(): Observable<number> {
    return this.http.get<number>(apiUrl+'action=getTotalExpenses');
  }

  updateExpense(expense: any): Observable<any> {
    return this.http.get<string>(apiUrl+'action=update&model=expenses&where=id='+expense.id+'&date='+expense.date+
    '&description='+expense.description+'&quantity='+expense.quantity+'&category='+expense.category);
  }

  createExpense(expense: any): Observable<string> {
    return this.http.get<string>(apiUrl+'action=add&model=expenses&date='+expense.date+
    '&description='+expense.description+'&quantity='+expense.quantity+'&category='+expense.category);
  }

}
