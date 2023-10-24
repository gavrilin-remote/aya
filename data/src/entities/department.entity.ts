import { Column, Entity, OneToMany } from "typeorm";
import Model from "./model.entity";
import { Employee } from "./emloyee.entity";

@Entity("departments")
export class Department extends Model {
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
