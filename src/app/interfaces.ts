
export interface NameAndId {
  id: number;
  name: string;
}

export interface NameIdAndOptions extends NameAndId {
  options: Array<NameAndId>;
}
