import { Pipe, PipeTransform } from '@angular/core';
import { Category, Employee } from '../interfaces';

const defaultFilter = (option: Employee, searchTerm: string) => {
  if (searchTerm === '') {
    return true;
  }

  return option.name.toLowerCase().includes(searchTerm.toLowerCase().trim());
};

@Pipe({
  name: 'arrayFilter'
})
export class ArrayFilterPipe implements PipeTransform {

  transform(value: Category[], args?: string): Category[] {
    const searchTerm = args || '';
    const filtered = value.map(optgroup => {
      const subFiltered = (optgroup.employees || []).filter(subOption => defaultFilter(subOption, searchTerm));
      const newGroup: Category = {
        ...optgroup,
        employees: subFiltered
      };
      return newGroup;
    });

    return filtered;
  }

}
