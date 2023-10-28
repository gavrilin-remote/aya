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

export interface DumpInputV1 {
  employees: EmployeeListItemInput[];
  rates: RateInput[];
}
