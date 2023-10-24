import { Column, JoinColumn, Entity, ManyToOne, OneToMany } from "typeorm";
import Model from "./model.entity";
import { Department } from "./department.entity";
import { Statement } from "./statement.entity";
import { Donatioin } from "./donation.entity";

@Entity("employees")
export class Employee extends Model {
  /**
   * Employee first name
   *
   * @example "Jon"
   */
  @Column()
  name: string;

  /**
   * Employee last name
   *
   * @example "Doe"
   */
  @Column()
  sername: string;

  /**
   * The department employee belongs to
   */
  @ManyToOne(() => Department)
  @JoinColumn()
  department: Department;

  /**
   * The list of associated statements
   */
  @OneToMany(() => Statement, (statement) => statement.employee)
  statements: Statement[];

  /**
   * The list of associated donations
   */
  @OneToMany(() => Donatioin, (donation) => donation.employee)
  donations: Donatioin[];
}
