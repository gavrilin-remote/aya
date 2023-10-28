import fs from "fs/promises";
import path from "path";
import { parseDumpToObjects } from "./parser";

import { AppDataSource } from "@data/data-source";
import { ExchangeRate } from "@data/entities/exchange-rate.entity";
import { Employee } from "@data/entities/emloyee.entity";
import { Department } from "@data/entities/department.entity";
import { Statement } from "@data/entities/statement.entity";
import { type EmployeeListItemInput, type RateInput } from "./types";
import { Donatioin } from "@data/entities/donation.entity";

class DumpImporter {
  _dumpFilePath: string;

  constructor(dumpFileName: string) {
    this._dumpFilePath = path.join(__dirname, dumpFileName);
  }

  async run(): Promise<void> {
    await AppDataSource.initialize();
    console.log("DataSource initialized...");
    const dumpString = await this.loadDumpFile();
    console.log("Dump file is loaded...");
    const { rates, employees } = parseDumpToObjects(dumpString);
    console.log("Dump string is converted to objects...");
    await this.importExchangeRates(rates);
    console.log("Exchange Rates imported...");
    await this.importEmployees(employees);
    console.log("Employees imported...");
  }

  async loadDumpFile(): Promise<string> {
    return await fs.readFile(this.dumpFilePath, { encoding: "utf8" });
  }

  async importExchangeRates(rates: RateInput[]): Promise<void> {
    await Promise.all(
      rates.map((r) => {
        const exchangeRate = new ExchangeRate();
        exchangeRate.currency = r.sign;
        exchangeRate.price = r.value;
        exchangeRate.createdAt = r.date;
        return ExchangeRate.save(exchangeRate);
      }),
    );
  }

  async importEmployees(employees: EmployeeListItemInput[]): Promise<void> {
    await Promise.all(
      employees.map(async ({ employee, department, statements, donations }) => {
        const departmentToSave = new Department();
        departmentToSave.name = department.name;
        departmentToSave.id = department.id;
        await Department.upsert(departmentToSave, ["id"]);

        const employeeToSave = new Employee();
        employeeToSave.id = employee.id;
        employeeToSave.name = employee.name;
        employeeToSave.surname = employee.surname;
        employeeToSave.department = departmentToSave;
        // save statements
        employeeToSave.statements = await Promise.all(
          statements.map((st) => {
            const statementToSave = new Statement();
            statementToSave.amount = st.amount;
            statementToSave.createdAt = st.date;
            statementToSave.id = st.id;
            return Statement.save(statementToSave);
          }),
        );
        // save donations
        employeeToSave.donations = await Promise.all(
          donations.map(async (donation) => {
            const donationToSave = new Donatioin();
            const { currency, amount } = donation.amount;
            if (currency === "USD") {
              donationToSave.amount = amount;
            } else {
              const exchangeRate = await this.readExchangeRateAsync(currency);
              if (!exchangeRate) {
                throw new Error(`Exchange rate for ${currency} not found`);
              }
              donationToSave.amount = amount * exchangeRate.price;
            }
            donationToSave.createdAt = donation.date;
            donationToSave.id = donation.id;
            return Donatioin.save(donationToSave);
          }),
        );
        return Employee.save(employeeToSave);
      }),
    );
  }

  async readExchangeRateAsync(currency: string): Promise<ExchangeRate | null> {
    return ExchangeRate.createQueryBuilder("er")
      .distinctOn(["er.currency"])
      .andWhere("er.currency = :currency", { currency })
      .addOrderBy("er.currency")
      .addOrderBy("er.created_at", "DESC")
      .getOne();
  }

  get dumpFilePath(): string {
    return this._dumpFilePath;
  }
}

const importer = new DumpImporter("dump.txt");

importer
  .run()
  .catch(async (e) => {
    console.log("Failed to import dump: ", e);
  })
  .finally(() => {
    AppDataSource.destroy().then(() => {
      process.exit(0);
    });
  });
