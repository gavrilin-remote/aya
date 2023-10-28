import { Router } from "express";
import { wrapAsyncError } from "@app/utils";
import { AppDataSource } from "@data/data-source";

const router = Router();

router.get(
  "/calculate",
  wrapAsyncError(async (_, res) => {
    const qr = AppDataSource.createQueryRunner();
    const result = await qr.manager.query(
      `SELECT e.id as employee_id, 10000 / 100 * SUM(d.amount) / ((SELECT SUM(amount) from donations) / 100) as rewards 
      FROM employees as e 
      INNER JOIN donations as d ON d.employee_id = e.id 
      WHERE (SELECT SUM(amount) FROM donations WHERE employee_id = e.id) > 100 
      GROUP BY e.id`,
    );
    res.send(result);
  }),
);

export default router;
