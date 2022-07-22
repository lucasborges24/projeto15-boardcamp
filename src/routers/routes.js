import { Router } from "express";

import {
  categoriesController as cC,
  gamesController as gC,
} from "../controllers/index.js";

import {
  categoriesMiddleware as cM,
  gamesMiddleware as gM,
} from "../middlewares/index.js";

const router = Router();

// categories routes
router.get("/categories", cC.getCategories);
router.post(
  "/categories",
  cM.validateBody,
  cM.checkCategoryAlreadyExist,
  cC.postCategories
);

// games routes
router.post(
  "/games",
  gM.validateBody,
  gM.checkCategoryIdExist,
  gM.checkNameAlreadyExist,
  gC.postGame
);

export default router;
