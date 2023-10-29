export interface EmployeeInput {
  id: number;
  name: string;
  surname: string;
}

export interface DepartmentInput {
  id: number;
  name: string;
}

export interface StatementInput {
  id: number;
  amount: number;
  date: Date;
}

export interface DonatioinInput {
  id: number;
  amount: { amount: number; currency: string };
  date: Date;
}

export interface RateInput {
  date: Date;
  sign: string;
  value: number;
}

export interface EmployeeListItemInput {
  employee: EmployeeInput;
  department: DepartmentInput;
  statements: StatementInput[];
  donations: DonatioinInput[];
}

export interface DumpInput {
  employees: EmployeeListItemInput[];
  rates: RateInput[];
}

export enum FieldTypes {
  string = "string",
  number = "number",
  date = "date",
  numberWithCurrency = "numberWithCurrency",
}

export type Codec = Record<string, FieldTypes>;

export interface ParserConfig {
  title: string;
  delimiters: {
    rates: string;
    rate: string;
    field: string;
    employee: string;
    salary: string;
    statements: string;
    department: string;
    donations: string;
    donation: string;
  };
  codecs: {
    rate: Codec;
    employee: Codec;
    department: Codec;
    statement: Codec;
    donation: Codec;
  };
}
