export interface Option {
  value: any;
  name: any;
}

export interface Select {
  value?: number;
  options?: Option[];
  show?: boolean;
  attrs?: object;
}

export interface Selects {
  d: Select;
  m: Select;
  y: Select;
}
