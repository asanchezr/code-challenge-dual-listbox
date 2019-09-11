import { Component } from '@angular/core';
import { Category, Employee } from './interfaces.js';

// import from JSON file
import employees from '../assets/data/employees.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  employeesList: Category[] = employees.data;
  selectedEmployees: Employee[] = [];
}
