import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-filter',
  styleUrls: ['./filter.component.scss'],
  template: `
    <input type="text" class="form-control" [value]="searchTerm" placeholder="{{placeholder}}" (input)="onChange($event)">
  `
})
export class FilterComponent implements OnInit {

  @Input() placeholder = 'Filter...';
  @Input() searchTerm = '';
  @Output() filterChange = new EventEmitter<string>();

  constructor() { }
  ngOnInit() { }
  onChange(e) { this.filterChange.emit(e.target.value); }
}
