// src/routes/career.routes.js
import express from "express";
import { submitCareerApplication } from "../controllers/career.controller.js";

const router = express.Router();

// POST /api/careers/apply
// No file upload — resume is a plain URL string in JSON body
router.post("/apply", submitCareerApplication);

export default router;