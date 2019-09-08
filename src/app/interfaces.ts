
export interface HasId {
  id: number;
}

export interface Employee extends HasId {
  name: string;
}

export interface Category extends HasId {
  name: string;
  options: Employee[];
}

export type FilterFn = (o: Employee) => boolean;
