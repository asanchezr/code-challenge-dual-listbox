
export interface Employee {
  id: number;
  name: string;
}

export interface Category {
  id: number;
  name: string;
  employees: Employee[];
}

export type FilterFn = (o: Employee) => boolean;
