import { Router } from "express";

import { categoriesController } from "../controllers/index.js";

const router = Router();

// categories routes
router.get("/categories", categoriesController.getCategories);

export default router;
