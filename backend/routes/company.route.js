import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { getCompany, getCompanyById, registerCompany, updateCompany } from "../controllers/company.controller.js";
import { singleUpload } from "../middlewares/mutler.js";

const router = express.Router();

// Routes that require authentication
router.route("/register").post(isAuthenticated, registerCompany);
router.route("/get").get(isAuthenticated, getCompany);
router.route("/update/:id").put(isAuthenticated, singleUpload, updateCompany);

// Public route for viewing company details
router.route("/get/:id").get(getCompanyById);

export default router;

