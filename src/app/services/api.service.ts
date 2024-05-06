import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// TODO: modify no funciona



@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = "http://localhost/ContabilidadAngular/api/apiService.php?";//cors=1&"

  constructor(private http: HttpClient) { }

  get(model: string, filter: string, sortDirection: string, page: number, offset: number): Observable<any[]> {
    let where = (filter !== '') ? "&where=descripcion LIKE '%"+filter+"%'" : '';
    return this.http.get<any[]>(this.apiUrl+'action=get&model='+model+where
    +'&orderHow='+sortDirection+'&page='+page+'&offset='+offset);
  }

  delete(model: string, id: number): Observable<string> {
    return this.http.get<string>(this.apiUrl+'action=delete&model='+model+'&id='+id);
  }

  getTotalExpenses(): Observable<number> {
    return this.http.get<number>(this.apiUrl+'action=getTotalExpenses');
  }

  getNum(model: string): Observable<number> {
    return this.http.get<number>(this.apiUrl+'action=getNum&model='+model);
  }

  updateExpense(expense: any): Observable<string> {
    return this.http.get<string>(this.apiUrl+'action=create&model=gastos&fecha='+expense.date+
    '&descripcion='+expense.description+'&importe='+expense.quantity+'&categoria='+expense.category);
  }

  createExpense(expense: any): Observable<string> {
    return this.http.get<string>(this.apiUrl+'action=add&model=gastos&date='+expense.date+
    '&description='+expense.description+'&quantity='+expense.quantity+'&category='+expense.category);
  }

}
