import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ExpensesComponent } from './pages/expenses/expenses.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { CreateExpenseComponent } from './pages/create-expense/create-expense.component';


export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'expenses', component: ExpensesComponent },
    { path: 'categories', component: CategoriesComponent },
    { path: 'createExpense', component: CreateExpenseComponent },
    { path: '**', redirectTo: '', pathMatch: 'full' }];
