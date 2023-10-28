import { Router } from "express";

import RewardsRouter from "./rewards.router";

const router = Router();
router.use("/rewards", RewardsRouter);

export default router;
