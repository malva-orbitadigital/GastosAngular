import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, shareReplay } from 'rxjs';

// TODO: modify no funciona (Invalid action)

const apiUrl = "http://localhost/ContabilidadAngular/api/apiService.php?";//cors=1&"

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  get(model: string, filter: string, sortDirection: string, page: number, offset: number): Observable<any[]> {
    let where = (filter !== '') ? "&where=description LIKE '%"+filter+"%'" : '';
    return this.http.get<any[]>(apiUrl+'action=get&model='+model+where
    +'&orderHow='+sortDirection+'&page='+page+'&offset='+offset);
  }

  delete(model: string, id: number): Observable<string> {
    return this.http.get<string>(apiUrl+'action=delete&model='+model+'&id='+id);
  }

  getTotalExpenses(): Observable<number> {
    return this.http.get<number>(apiUrl+'action=getTotalExpenses');
  }

  getNum(model: string): Observable<number> {
    return this.http.get<number>(apiUrl+'action=getNum&model='+model);
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
