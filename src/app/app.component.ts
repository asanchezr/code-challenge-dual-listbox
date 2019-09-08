import { Component } from '@angular/core';
import { Category } from './interfaces.js';
import employees from '../assets/data/employees.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  employeesList: Category[] = employees.data;
}
