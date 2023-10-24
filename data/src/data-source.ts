/* eslint-disable import/first, import/order */
import * as dotenv from "dotenv";
dotenv.config({ path: "../.env.base" });
dotenv.config({ path: "../.env", override: true });
import path from "path";
import config from "config";
import { DataSource, type DataSourceOptions } from "typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";

const database = config.get<{
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}>("database");

const dirname = path.dirname(__dirname);

const options: DataSourceOptions = {
  ...database,

  logging: false,
  namingStrategy: new SnakeNamingStrategy(),
  synchronize: false,
  type: "postgres",
  entities: [path.resolve(dirname, "src/entities/**/*.entity.{ts,js}")],
  migrations: [path.resolve(dirname, "src/migrations/**/*.{ts,js}")],
};

export const AppDataSource = new DataSource(options);
