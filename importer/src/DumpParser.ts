import {
  type DumpInput,
  FieldTypes,
  type RateInput,
  type ParserConfig,
  type EmployeeInput,
  type DepartmentInput,
  type StatementInput,
  type DonatioinInput,
} from "./types";
import merge from "lodash.merge";
import { filterEmptyString, parseField, transformFieldsToObject } from "./utils";

const DEFAULT_PARSER_CONFIG: ParserConfig = {
  title: "E-List",
  delimiters: {
    field: "\n",
    rates: "Rates",
    rate: "Rate",
    employee: "Employee",
    salary: "Salary",
    statements: "Statement",
    donations: "\n\n\n",
    donation: "Donation",
    department: "Department",
  },
  codecs: {
    rate: {
      sign: FieldTypes.string,
      value: FieldTypes.number,
      date: FieldTypes.date,
    },
    employee: {
      id: FieldTypes.number,
      name: FieldTypes.string,
      surname: FieldTypes.string,
    },
    department: {
      id: FieldTypes.number,
      name: FieldTypes.string,
    },
    statement: {
      id: FieldTypes.number,
      amount: FieldTypes.number,
      date: FieldTypes.date,
    },
    donation: {
      id: FieldTypes.number,
      amount: FieldTypes.numberWithCurrency,
      date: FieldTypes.date,
    },
  },
};

export class DumpParser {
  config: ParserConfig;

  constructor(config?: Partial<ParserConfig>) {
    this.config = merge(DEFAULT_PARSER_CONFIG, config ?? {});
  }

  /**
   * Parse dump data from string to object
   * @param dump string
   * @returns object model of the dump
   */
  parse(dump: string): DumpInput {
    const { title, delimiters, codecs } = this.config;
    // remove title
    dump = dump.replace(title, "");
    // split rates and employees
    const [employeesSubstring, ratesSubString] = dump.split(delimiters.rates);

    // Parse exchange rates section
    const ratesFragments = ratesSubString.trim().split(delimiters.rate).filter(filterEmptyString);
    const rates = ratesFragments.map((fragment) => {
      const rateFields = fragment.trim().split(delimiters.field).map(parseField);
      return transformFieldsToObject(rateFields, codecs.rate) as RateInput;
    });

    // Parse employees section
    const employeeFragments = employeesSubstring
      .trim()
      .split(delimiters.employee)
      .filter(filterEmptyString);
    const employees = employeeFragments.map((employeeFragment) => {
      // split employee info and rest
      const [employeeSubstr, rest] = employeeFragment
        .trim()
        .split(delimiters.department)
        .filter(filterEmptyString);
      // Parse employee
      const employeeFields = employeeSubstr.trim().split(delimiters.field).map(parseField);
      const employee = transformFieldsToObject(employeeFields, codecs.employee) as EmployeeInput;

      // Parse department
      const [departmentSubstr, salaryAndDonationSubstr] = rest
        .trim()
        .split(delimiters.salary)
        .filter(filterEmptyString);
      const departmentFields = departmentSubstr.trim().split(delimiters.field).map(parseField);
      const department = transformFieldsToObject(departmentFields, codecs.department) as DepartmentInput;

      // Parse salary section
      const [salarySubstr, donationsSubstr] = salaryAndDonationSubstr
        .trim()
        .split(delimiters.donations)
        .filter(filterEmptyString);

      // Parse statements
      let statements: StatementInput[] = [];
      if (salarySubstr) {
        const statementFragments = salarySubstr
          .trim()
          .split(delimiters.statements)
          .filter(filterEmptyString);

        statements = statementFragments.map((statementFragment) => {
          const statementFields = statementFragment
            .trim()
            .split(delimiters.field)
            .filter(filterEmptyString)
            .map(parseField);
          return transformFieldsToObject(statementFields, codecs.statement) as StatementInput;
        });
      }

      // Parse donations
      let donations: DonatioinInput[] = [];
      if (donationsSubstr) {
        const donationFragments = donationsSubstr
          .trim()
          .split(delimiters.donation)
          .filter(filterEmptyString);
        donations = donationFragments.map((donationFragment) => {
          const donationFields = donationFragment
            .trim()
            .split(delimiters.field)
            .filter(filterEmptyString)
            .map(parseField);
          return transformFieldsToObject(donationFields, codecs.donation) as DonatioinInput;
        });
      }

      return { employee, department, statements, donations };
    });

    return {
      rates,
      employees,
    };
  }
}
