import { Column, Entity } from "typeorm";
import Model from "./model.entity";

@Entity("departments")
export class Department extends Model {
  /**
   * The name of department
   *
   * @example "Kids"
   */
  @Column()
  name: string;
}
