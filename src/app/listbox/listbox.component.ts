import { Component, OnInit, OnChanges, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NameAndId } from '../interfaces';

const defaultFilter = (option: NameAndId, searchTerm: string) => {
  return option.name.toLowerCase().includes(searchTerm.toLowerCase().trim());
};

@Component({
  selector: 'app-listbox',
  templateUrl: './listbox.component.html',
  styleUrls: ['./listbox.component.scss']
})
export class ListboxComponent implements OnInit, OnChanges {

  // data source
  dataSource = [
    {
      id: 1,
      name: 'Group 1',
      options: [
        { id: 100, name: 'Alfred Young' },
        { id: 101, name: 'Seasick Jean' },
      ]
    },
    {
      id: 2,
      name: 'Group 2',
      options: [
        { id: 102, name: 'Josh Donaldson' },
        { id: 103, name: 'Mickey Mantle' },
      ]
    },
  ];

  @Input() searchTerm = '';
  @Input() canFilter = true;

  @Output() filterChange = new EventEmitter<string>();

  filterControl = new FormControl('');
  pickListControl = new FormControl([]);

  constructor() { }

  ngOnInit() { }

  ngOnChanges(changes: SimpleChanges) {
    const { searchTerm } = changes;
    if (searchTerm) {
      this.filterControl.setValue(searchTerm.currentValue);
    }
  }

  getData(searchTerm: string = '') {
    return this.dataSource.map(e => ({ ...e, options: e.options.filter(o => defaultFilter(o, searchTerm)) }));
  }

  onFilterChange(value: string) {
    this.filterChange.emit(value);
    this.filterControl.setValue(value);
  }
}
