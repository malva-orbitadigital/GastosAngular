import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ExpensesComponent } from './pages/expenses/expenses.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { SearchComponent } from './pages/search/search.component';
import { CreateExpenseComponent } from './pages/create-expense/create-expense.component';


export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'expenses', component: ExpensesComponent },
    { path: 'categories', component: CategoriesComponent },
    { path: 'search', component: SearchComponent },
    { path: 'createExpense', component: CreateExpenseComponent }, // TODO hacerlo con un mat-dialog la modificacion de la categoria
    { path: '**', redirectTo: '', pathMatch: 'full' }];
