import { Component, OnInit } from '@angular/core';

interface NameAndId {
  id: number;
  name: string;
}

const defaultFilter = (option: NameAndId, searchTerm: string) => option.name.toLowerCase().includes(searchTerm.toLowerCase().trim());

@Component({
  selector: 'app-listbox',
  templateUrl: './listbox.component.html',
  styleUrls: ['./listbox.component.scss']
})
export class ListboxComponent implements OnInit {

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

  constructor() { }

  ngOnInit() {
  }

  getData(searchTerm: string = '') {
    return this.dataSource.map(e => ({ ...e, options: e.options.filter(o => defaultFilter(o, searchTerm)) }));
  }
}
