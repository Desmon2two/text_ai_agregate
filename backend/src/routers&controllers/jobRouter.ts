import express from "express";
import {authenticate} from "../middlewears/authMiddleware";
const router = express.Router();

router.post("/job", /*authenticate,*/ jobController.addJob);
router.get("/job_id", authenticate, jobController.getJob);

export default router;
