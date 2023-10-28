import {
  type DumpInputV1,
  type RateInput,
  type EmployeeListItemInput,
  type EmployeeInput,
  type DepartmentInput,
  type StatementInput,
  type DonatioinInput,
} from "./types";

const filterEmptyString = (str: string): boolean => str.trim().length > 0;

enum FieldTypes {
  string = "string",
  number = "number",
  date = "date",
  numberWithCurrency = "numberWithCurrency",
}

type Codec = Record<string, FieldTypes>;

const FieldTransformers: Record<
  FieldTypes,
  (str: string) => string | number | Date | { amount: number; currency: string }
> = {
  [FieldTypes.string]: (str) => str.trim(),
  [FieldTypes.number]: (str) => {
    const numb = Number(str);
    if (isNaN(numb)) {
      throw new Error("Invalid number");
    }
    return numb;
  },
  [FieldTypes.date]: (str) => {
    const date = new Date(str);
    if (!isFinite(Number(date)) && isNaN(Number(date))) {
      throw new Error("Invalid date");
    }
    return date;
  },
  [FieldTypes.numberWithCurrency]: (str) => {
    const [amount, currency] = str.split(" ");
    const result = {
      amount: Number(amount),
      currency: currency.trim(),
    };
    if (isNaN(result.amount)) {
      throw new Error("Invalid amount");
    }
    if (!result.currency.length) {
      throw new Error("Invalid currency");
    }
    return result;
  },
};

const parseField = (field: string): [string, string] => {
  const fieldDelimiter = ": ";
  const [k, v] = field.trim().split(fieldDelimiter);
  if (!k?.trim().length) {
    throw new Error(`Can't parse field. Empty key is not allowed.`);
  }
  if (!v?.trim().length) {
    throw new Error(`Can't parse field. Empty value is not allowed.`);
  }
  return [k.trim(), v.trim()];
};

const transformFieldsToObject = (fields: Array<[string, string]>, codec: Codec): object => {
  return fields.reduce((acc, [k, v]) => {
    const transformer = FieldTransformers[codec[k]];
    if (!transformer) {
      console.log([k, v]);
      throw new Error("Invalid field!");
    }
    return { ...acc, [k]: transformer(v) };
  }, {});
};

export const parseDumpToObjects = (dump: string): DumpInputV1 => {
  const ratesDelimiter = "Rates";

  // remove title
  dump = dump.replace("E-List", "");

  const [employeesSubstring, ratesSubString] = dump.split(ratesDelimiter);
  const rates = parseRates(ratesSubString);
  const employees = parseEmployees(employeesSubstring);

  return { rates, employees };
};

const RateCodec: Codec = {
  sign: FieldTypes.string,
  value: FieldTypes.number,
  date: FieldTypes.date,
};

const parseRates = (ratesSubString: string): RateInput[] => {
  const rateDelimiter = "Rate";
  const ratesFragments = ratesSubString.trim().split(rateDelimiter).filter(filterEmptyString);
  const rates: RateInput[] = [];
  for (let i = 0; i < ratesFragments.length; i++) {
    const rateFields = ratesFragments[i].trim().split("\n").map(parseField);
    const rate = transformFieldsToObject(rateFields, RateCodec);
    rates.push(rate as RateInput);
  }
  return rates;
};

const EmployeeCodec: Codec = {
  id: FieldTypes.number,
  name: FieldTypes.string,
  surname: FieldTypes.string,
};

const DepartmentCodec: Codec = {
  id: FieldTypes.number,
  name: FieldTypes.string,
};

const StatementCodec: Codec = {
  id: FieldTypes.number,
  amount: FieldTypes.number,
  date: FieldTypes.date,
};

const DonationCodec: Codec = {
  id: FieldTypes.number,
  amount: FieldTypes.numberWithCurrency,
  date: FieldTypes.date,
};

const parseEmployees = (employeesSubstring: string): EmployeeListItemInput[] => {
  const employeeDelimiter = "Employee";
  const departmentDelimiter = "Department";
  const salaryDelimiter = "Salary";
  const donationsDelimiter = "\n\n\n";
  const statementDelimiter = "Statement";
  const donationDelimiter = "Donation";
  const employeeFragments = employeesSubstring.trim().split(employeeDelimiter).filter(filterEmptyString);
  const employeesList: EmployeeListItemInput[] = [];
  for (let i = 0; i < employeeFragments.length; i++) {
    const [employeeSubstr, rest] = employeeFragments[i]
      .trim()
      .split(departmentDelimiter)
      .filter(filterEmptyString);

    const employeeFields = employeeSubstr.trim().split("\n").map(parseField);
    const employee = transformFieldsToObject(employeeFields, EmployeeCodec) as EmployeeInput;

    const [departmentSubstr, salaryAndDonationSubstr] = rest
      .trim()
      .split(salaryDelimiter)
      .filter(filterEmptyString);

    const departmentFields = departmentSubstr.trim().split("\n").map(parseField);
    const department = transformFieldsToObject(departmentFields, DepartmentCodec) as DepartmentInput;

    const [salarySubstr, donationsSubstr] = salaryAndDonationSubstr
      .trim()
      .split(donationsDelimiter)
      .filter(filterEmptyString);

    const statements = [];
    if (salarySubstr) {
      const statementFragments = salarySubstr.trim().split(statementDelimiter).filter(filterEmptyString);

      for (let j = 0; j < statementFragments.length; j++) {
        const statementFields = statementFragments[j]
          .trim()
          .split("\n")
          .filter(filterEmptyString)
          .map(parseField);
        const statement = transformFieldsToObject(statementFields, StatementCodec) as StatementInput;
        statements.push(statement);
      }
    }

    const donations = [];
    if (donationsSubstr) {
      const donationFragments = donationsSubstr
        .trim()
        .split(donationDelimiter)
        .filter(filterEmptyString);
      for (let j = 0; j < donationFragments.length; j++) {
        const donationFields = donationFragments[j]
          .trim()
          .split("\n")
          .filter(filterEmptyString)
          .map(parseField);
        const donation = transformFieldsToObject(donationFields, DonationCodec) as DonatioinInput;
        donations.push(donation);
      }
    }

    employeesList.push({ employee, department, statements, donations });
  }
  return employeesList;
};
