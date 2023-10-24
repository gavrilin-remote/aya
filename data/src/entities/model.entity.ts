import {
  BaseEntity,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

/**
 * Represents an abstract base model that all other entities in the system extend from.
 *
 * This abstract model defines base columns that are common to all entities. The columns are the
 * auto-generated *id*, *createdAt*, *deletedAt*, and *updatedAt* timestamps.
 *
 * All other entities will extend this abstract base model, inheriting the *id*, *createdAt*,
 * *deletedAt*, and *updatedAt* properties. This avoids having to redefine the same basic fields for
 * every single model.
 *
 * Example:
 * ```json
 * {
 *  "id": "44355",
 *  "createdAt": "2023-01-01T00:00:00.000Z",
 *  "deletedAt": null,
 *  "updatedAt": "2023-01-01T00:00:00.000Z"
 * }
 * ```
 */
export default abstract class Model extends BaseEntity {
  /**
   * The unique record identifier
   *
   * @example "44355"
   */
  @PrimaryGeneratedColumn("increment")
  id: number;

  /**
   * The date and time the record was created
   *
   * @example "2023-01-01T00:00:00.000Z"
   */
  @CreateDateColumn()
  createdAt: Date;

  /**
   * The date and time the record was deleted
   *
   * @example "2023-01-01T00:00:00.000Z"
   * @example null
   */
  @DeleteDateColumn()
  deletedAt: Date | null;

  /**
   * The date and time the record was updated
   *
   * @example "2023-01-01T00:00:00.000Z"
   */
  @UpdateDateColumn()
  updatedAt: Date;
}
