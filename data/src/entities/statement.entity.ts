import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import Model from "./model.entity";
import { DecimalTransformer } from "../transformers/decimal.transformer";
import { Employee } from "./emloyee.entity";

@Entity("statements")
export class Statement extends Model {
  /**
   * The unique record identifier
   *
   * @example "44355"
   */
  @PrimaryColumn()
  id: number;

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

  /**
   * The employee
   */
  @ManyToOne(() => Employee)
  @JoinColumn()
  employee: Employee;
}
