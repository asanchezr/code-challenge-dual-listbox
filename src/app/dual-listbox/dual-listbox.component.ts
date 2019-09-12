import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Category, Employee, FilterFn } from '../interfaces';

interface ListState {
  items: Category[];
  filter: string;
  picklistSelection: number[];
}

const defaultSort = (a: Employee, b: Employee) => {
  if (a.name < b.name) { return -1; }
  if (a.name > b.name) { return 1; }
  return 0;
};

@Component({
  selector: 'app-dual-listbox',
  templateUrl: './dual-listbox.component.html',
  styleUrls: ['./dual-listbox.component.scss']
})
export class DualListboxComponent implements OnInit {

  private source: Category[] = [];

  @Input('source') set sourceValues(values: Category[]) {
    // ensure values are sorted alphabetically
    this.source = values.map(optgroup => {
      const newCategory: Category = {
        ...optgroup,
        employees: optgroup.employees.sort(defaultSort)
      };
      return newCategory;
    });
  }

  @Input() selected: number[] = [];
  @Output() selectedChange = new EventEmitter<Employee[]>();

  // internal state
  left: ListState = {
    items: [],
    filter: '',
    picklistSelection: []
  };

  right: ListState = {
    items: [],
    filter: '',
    picklistSelection: []
  };

  constructor() { }

  // Counts all amployees wihtin a picklist/listbox
  count(list: Category[]): number {
    return (this.getFlatOptions(list) || []).length;
  }

  ngOnInit() {
    this.left.items = this.filterAvailable(this.source, this.left.filter);
    this.right.items = this.filterSelected(this.source, this.right.filter);
  }

  onSelectionChange(list: ListState, selectedValues: number[]) {
    list.picklistSelection = selectedValues;
  }

  moveAllToRight() {
    if (!this.left.items.length) {
      return;
    }

    // ignore the search filter when moving all items
    const available = this.filterAvailable(this.source);
    const previouslySelected = this.selected;
    const selected = [
      ...previouslySelected,
      ...this.getFlatOptions(available)
    ];
    this.onChange(selected);
  }

  moveAllToLeft() {
    if (!this.right.items.length) {
      return;
    }

    const selected = [];
    this.onChange(selected);
  }

  moveSelectedToRight() {
    if (!this.left.picklistSelection.length) {
      return;
    }

    const previouslySelected = this.selected;
    const selected = [
      ...previouslySelected,
      ...this.left.picklistSelection
    ];
    this.onChange(selected);
  }

  moveSelectedToLeft() {
    if (!this.right.picklistSelection.length) {
      return;
    }

    const previouslySelected = this.selected;
    const selected = previouslySelected.filter(value => this.right.picklistSelection.indexOf(value) < 0);
    this.onChange(selected);
  }

  private onChange(selected: number[]) {
    this.selected = [...selected];

    // update listboxes
    this.left.items = this.filterAvailable(this.source, this.left.filter);
    this.right.items = this.filterSelected(this.source, this.right.filter);

    // Reconstruct selected-ids into objects
    const all = this.source.reduce((array, optgroup) => [...array, ...optgroup.employees], [] as Employee[]);
    const selectedOptions = all.filter(option => selected.includes(option.id));
    this.selectedChange.emit(selectedOptions);
  }

  private filterAvailable(options: Category[], filterValue: string = ''): Category[] {
    // The default is to only show available options when they are not selected
    // AND also make sure they match the typed in filter value (if any)
    const filterer: FilterFn = (option: Employee) => this.selected.indexOf(option.id) < 0;

    return this.filterOptions(options, filterer);
  }

  private filterSelected(options: Category[], filterValue: string = ''): Category[] {
    const filterer: FilterFn = (option: Employee) => this.selected.indexOf(option.id) >= 0;

    return this.filterOptions(options, filterer);
  }

  private filterOptions(groups: Category[], filterer: FilterFn): Category[] {
    // Filter any children of parent optgroups
    const filtered = groups.map(optgroup => {
      const subFiltered = (optgroup.employees || []).filter(subOption => filterer(subOption));
      const newGroup: Category = {
        ...optgroup,
        employees: subFiltered
      };
      return newGroup;
    });

    return filtered;
  }

  private getFlatOptions(groups: Category[]): number[] {
    // Flatten the groups into an array of employees (sub-options)
    const flattened = (groups || []).reduce(
      (array, optgroup) => [...array, ...this.getFlatValues(optgroup.employees)],
      [] as number[]
    );
    return flattened;
  }

  // get values (IDs) from selected items
  private getFlatValues(employees: Employee[]): number[] {
    return (employees || []).map(e => e.id);
  }
}
