import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { getAdminJobs, getAllJobs, getJobById, postJob } from "../controllers/job.controller.js";

const router = express.Router();

// Routes that require authentication
router.route("/post").post(isAuthenticated, postJob);
router.route("/getadminjobs").get(isAuthenticated, getAdminJobs);

// Public routes that don't require authentication
router.route("/get").get(getAllJobs);
router.route("/get/:id").get(getJobById);

export default router;

