// src/routes/consultation.routes.js
import express from "express";
import { submitConsultation } from "../controllers/consultation.controller.js";

const router = express.Router();

router.post("/", submitConsultation);

export default router;
