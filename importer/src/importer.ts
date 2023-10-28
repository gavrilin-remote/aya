import fs from "fs/promises";
import path from "path";
import { parseDumpToObjects } from "./parser";

import { AppDataSource } from "@data/data-source";
import { ExchangeRate } from "@data/entities/exchange-rate.entity";
import { Employee } from "@data/entities/emloyee.entity";
import { Department } from "@data/entities/department.entity";
import { Statement } from "@data/entities/statement.entity";
import { type RateInput } from "./types";
import { Donatioin } from "@data/entities/donation.entity";

const loadDumpAsStringAsync = async (): Promise<string> => {
  return await fs.readFile(path.join(__dirname, "./dump.txt"), { encoding: "utf8" });
};

const importRates = async (rates: RateInput[]): Promise<void> => {
  await Promise.all(
    rates.map((r) => {
      const exchangeRate = new ExchangeRate();
      exchangeRate.currency = r.sign;
      exchangeRate.price = r.value;
      exchangeRate.createdAt = r.date;
      return ExchangeRate.save(exchangeRate);
    }),
  );
};

const readLatestExchangeRateByCurrency = async (currency: string): Promise<ExchangeRate | null> => {
  return ExchangeRate.createQueryBuilder("er")
    .distinctOn(["er.currency"])
    .andWhere("er.currency = :currency", { currency })
    .addOrderBy("er.currency")
    .addOrderBy("er.created_at", "DESC")
    .getOne();
};

const importDumpInDbAsync = async (): Promise<void> => {
  const dump = await loadDumpAsStringAsync();
  const { rates, employees } = parseDumpToObjects(dump);

  await AppDataSource.initialize();

  await importRates(rates);

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
            const exchangeRate = await readLatestExchangeRateByCurrency(currency);
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
};

importDumpInDbAsync()
  .then(() => {
    console.log("Dump imported successfully!");
  })
  .catch((e) => {
    console.log("Failed to load dump: ", e);
  })
  .finally(() => {
    AppDataSource.destroy().then(() => {
      process.exit(0);
    });
  });
