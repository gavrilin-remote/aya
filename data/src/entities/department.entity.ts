import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import Model from "./model.entity";
import { Employee } from "./emloyee.entity";

@Entity("departments")
export class Department extends Model {
  /**
   * The unique record identifier
   *
   * @example "44355"
   */
  @PrimaryColumn()
  id: number;

  /**
   * The name of department
   *
   * @example "Kids"
   */
  @Column()
  name: string;

  /**
   * The list of associated employees
   */
  @OneToMany(() => Employee, (employee) => employee.department)
  employees: Employee[];
}
