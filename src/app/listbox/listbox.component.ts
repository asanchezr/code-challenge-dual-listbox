import { Component, OnInit, OnChanges, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Employee, Category } from '../interfaces';

const defaultFilter = (option: Employee, searchTerm: string) => {
  return option.name.toLowerCase().includes(searchTerm.toLowerCase().trim());
};

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
    if (filter) {
      this.filterControl.setValue(filter.currentValue as string);
    }
    if (source) {
      this.pickListControl.setValue([]);
    }
  }

  getData(searchTerm: string = '') {
    return this.source.map(e => ({ ...e, options: e.options.filter(o => defaultFilter(o, searchTerm)) }));
  }

  onFilterChange(value: string) {
    this.filterChange.emit(value);
    this.filterControl.setValue(value);
  }
}
