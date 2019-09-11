import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Category, Employee, FilterFn } from '../interfaces';

interface ListState {
  items: Category[];
  filter: string;
  picklistSelection: number[];
}

@Component({
  selector: 'app-dual-listbox',
  templateUrl: './dual-listbox.component.html',
  styleUrls: ['./dual-listbox.component.scss']
})
export class DualListboxComponent implements OnInit {

  @Input() source: Category[] = [];
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

  ngOnInit() {
    this.left.items = this.filterAvailable(this.source);
    this.right.items = this.filterSelected(this.source);
  }

  onLeftSelectionChange(selectedValues: number[]) {
    this.left.picklistSelection = selectedValues;
  }

  onRightSelectionChange(selectedValues: number[]) {
    this.right.picklistSelection = selectedValues;
  }

  moveAllToRight() {
    if (!this.left.items.length) {
      return;
    }

    const previouslySelected = this.selected;
    const selected = [
      ...previouslySelected,
      ...this.getFlatOptions(this.left.items)
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
    this.left.items = this.filterAvailable(this.source);
    this.right.items = this.filterSelected(this.source);

    // Reconstruct selected-ids into objects
    const all = this.source.reduce((array, optgroup) => [...array, ...optgroup.options], [] as Employee[]);
    const selectedOptions = all.filter(option => selected.includes(option.id));
    this.selectedChange.emit(selectedOptions);
  }

  private filterAvailable(options: Category[]): Category[] {
    // The default is to only show available options when they are not selected
    const filterer: FilterFn = (option: Employee) => this.selected.indexOf(option.id) < 0;
    return this.filterOptions(options, filterer);
  }

  private filterSelected(options: Category[]): Category[] {
    const filterer: FilterFn = (option: Employee) => this.selected.indexOf(option.id) >= 0;
    return this.filterOptions(options, filterer);
  }

  private filterOptions(groups: Category[], filterer: FilterFn): Category[] {
    // Filter any children of parent optgroups
    const filtered = groups.map(optgroup => {
      const subFiltered = (optgroup.options || []).filter(subOption => filterer(subOption));
      const newGroup: Category = { ...optgroup, options: subFiltered };
      return newGroup;
    });

    return filtered;
  }

  private getFlatOptions(groups: Category[]): number[] {
    // Flatten the optgroups into an array of employees (sub-options)
    const flattened = groups.reduce((array, optgroup) => [...array, ...this.getFlatValues(optgroup.options)], [] as number[]);
    return flattened;
  }

  // get values (IDs) from selected items
  private getFlatValues(options: Employee[]): number[] {
    return (options || []).map(o => o.id);
  }
}
