import { Component, OnInit, OnChanges, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Employee, Category } from '../interfaces';
@Component({
  selector: 'app-listbox',
  templateUrl: './listbox.component.html',
  styleUrls: ['./listbox.component.scss']
})
export class ListboxComponent implements OnInit, OnChanges {

  @Input() source: Category[] = [];
  @Input() canFilter = true;
  @Input() filter = '';
  @Output() filterChange = new EventEmitter<string>();
  @Output() selectionChange = new EventEmitter<number[]>();

  filterControl = new FormControl('');
  pickListControl = new FormControl([]);

  constructor() { }

  ngOnInit() {
    this.pickListControl
      .valueChanges
      .subscribe((items: number[]) => this.selectionChange.emit(items));
  }

  ngOnChanges(changes: SimpleChanges) {
    const { filter, source } = changes;
    if (source) {
      this.pickListControl.setValue([]);
    }
    if (filter) {
      this.onFilterChange(filter.currentValue as string);
    }
  }

  onFilterChange(value: string) {
    this.filterControl.setValue(value);
    this.pickListControl.setValue([]);
    this.filterChange.emit(value);
  }
}
