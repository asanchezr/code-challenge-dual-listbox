import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NameIdAndOptions, NameAndId } from '../interfaces';

@Component({
  selector: 'app-dual-listbox',
  templateUrl: './dual-listbox.component.html',
  styleUrls: ['./dual-listbox.component.scss']
})
export class DualListboxComponent implements OnInit {

  @Input() source: Array<NameIdAndOptions> = [];
  @Input() selected: Array<NameAndId> = [];

  @Output() selectedChange = new EventEmitter<Array<NameIdAndOptions>>();


  availableItems: Array<NameAndId> = [];
  selectedItems: Array<NameAndId> = [];

  availableFilter = '';
  selectedFilter = '';

  constructor() { }

  ngOnInit() {
    this.availableItems = this.source;
  }

  private flatten(items: NameIdAndOptions[]): number[] {
    const flattened: number[] = [];

    (items || []).forEach(optgroup => {
      // Flatten optgroup options
      if (optgroup.options) {
        optgroup.options.forEach(subOption => {
          flattened.push(subOption.id);
        });
      }
    });

    return flattened;
  }
}
