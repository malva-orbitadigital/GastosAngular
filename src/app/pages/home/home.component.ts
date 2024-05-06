import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  numExpenses: number = 0;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.apiService.getNum("gastos").subscribe(data => {
      this.numExpenses = data;
    })
  }

}
