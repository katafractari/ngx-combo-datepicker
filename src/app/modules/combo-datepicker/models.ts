export interface Option {
  value: any;
  name: any;
}

export interface Select {
  value?: number;
  options?: Option[];
  show?: boolean;
}

export interface Selects {
  d: Select;
  m: Select;
  y: Select;
}
