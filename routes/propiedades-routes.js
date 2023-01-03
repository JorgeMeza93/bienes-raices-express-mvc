import express from "express";
import { administarPropiedades } from "../controllers/propiedades-controller.js";

const router = express.Router();

router.get("/mis-propiedades", administarPropiedades);

export default router;