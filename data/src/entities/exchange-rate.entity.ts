import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

import { DecimalTransformer } from "../transformers/decimal.transformer";

import Model from "./model.entity";

@Entity("exchange_rates")
export class ExchangeRate extends Model {
  /**
   * The unique record identifier
   *
   * @example "44355"
   */
  @PrimaryGeneratedColumn("increment")
  id: number;

  /**
   * The exchange rate price
   *
   * @example 1.178175
   */
  @Column({
    precision: 39,
    scale: 18,
    transformer: new DecimalTransformer(),
    type: "decimal",
  })
  price: number;

  /**
   * The currency in the exchange rate
   *
   * @example "EUR"
   */
  @Index()
  @Column()
  currency: string;
}
