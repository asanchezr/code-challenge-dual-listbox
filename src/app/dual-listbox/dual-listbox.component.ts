import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Category, Employee, FilterFn } from '../interfaces';
import { filter } from 'minimatch';

@Component({
  selector: 'app-dual-listbox',
  templateUrl: './dual-listbox.component.html',
  styleUrls: ['./dual-listbox.component.scss']
})
export class DualListboxComponent implements OnInit {

  @Input() source: Category[] = [];
  @Input() selectedValues: number[] = [];
  @Output() selectedChange = new EventEmitter<Employee[]>();

  // internal state
  availableItems: Category[] = [];
  selectedItems: Category[] = [];

  availableFilter = '';
  selectedFilter = '';

  availablePicklistSelection: number[] = [];
  selectedPicklistSelection: number[] = [];

  constructor() { }

  ngOnInit() {
    this.availableItems = this.filterAvailable(this.source);
    this.selectedItems = this.filterSelected(this.source);
  }

  onLeftSelectionChange(selectedValues: number[]) {
    this.availablePicklistSelection = selectedValues;
  }

  onRightSelectionChange(selectedValues: number[]) {
    this.selectedPicklistSelection = selectedValues;
  }

  moveAllToRight() {
    if (!this.availableItems.length) {
      return;
    }

    const previouslySelected = this.selectedValues;
    const selected = [
      ...previouslySelected,
      ...this.getFlatOptions(this.availableItems)
    ];
    this.onChange(selected);
  }

  moveAllToLeft() {
    if (!this.selectedItems.length) {
      return;
    }

    const selected = [];
    this.onChange(selected);
  }

  moveSelectedToRight() {
    if (!this.availablePicklistSelection.length) {
      return;
    }

    const previouslySelected = this.selectedValues;
    const selected = [
      ...previouslySelected,
      ...this.availablePicklistSelection
    ];
    this.onChange(selected);
  }

  moveSelectedToLeft() {
    // TODO
  }

  private onChange(selected: number[]) {
    this.selectedValues = [...selected];

    // update listboxes
    this.availableItems = this.filterAvailable(this.source);
    this.selectedItems = this.filterSelected(this.source);

    // TODO: hydrate selected-ids into objects
    this.selectedChange.emit(null);
  }

  private filterAvailable(options: Category[]): Category[] {
    // The default is to only show available options when they are not selected
    const filterer: FilterFn = (option: Employee) => this.selectedValues.indexOf(option.id) < 0;
    return this.filterOptions(options, filterer);
  }

  private filterSelected(options: Category[]): Category[] {
    const filterer: FilterFn = (option: Employee) => this.selectedValues.indexOf(option.id) >= 0;
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
    const initialValue: number[] = [];
    const flattened = groups.reduce((array, optgroup) => [...array, ...this.getFlatValues(optgroup.options)], initialValue);
    return flattened;
  }

  // get values (IDs) from selected items
  private getFlatValues(options: Employee[]): number[] {
    return (options || []).map(o => o.id);
  }
}
