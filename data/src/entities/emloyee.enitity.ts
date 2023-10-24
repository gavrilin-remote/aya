import { Column, Entity } from "typeorm";
import Model from "./model.entity";

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
}
