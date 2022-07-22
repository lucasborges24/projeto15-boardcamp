import { Router } from "express";

import { categoriesController } from "../controllers/index.js";
import { categoriesMiddleware } from "../middlewares/index.js";

const router = Router();

// categories routes
router.get("/categories", categoriesController.getCategories);
router.post(
  "/categories",
  categoriesMiddleware.validateBody,
  categoriesMiddleware.checkCategoryAlreadyExist,
  categoriesController.postCategories
);

export default router;
