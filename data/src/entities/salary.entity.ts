import { Column, Entity } from "typeorm";
import Model from "./model.entity";
import { DecimalTransformer } from "../transformers/decimal.transformer";

@Entity("statements")
export class Statement extends Model {
  /**
   * Salary amount in USD
   *
   * @example "100.00"
   */
  @Column({
    precision: 39,
    scale: 18,
    transformer: new DecimalTransformer(),
    type: "decimal",
  })
  amount: number;
}
