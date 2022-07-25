import { Router } from "express";

import {
  categoriesController,
  gamesController,
  customersController,
} from "../controllers/index.js";

import {
  categoriesMiddleware,
  gamesMiddleware,
  customersMiddleware,
} from "../middlewares/index.js";

const router = Router();

// categories routes
router.get("/categories", categoriesController.getCategories);
router.post(
  "/categories",
  categoriesMiddleware.validateBody,
  categoriesMiddleware.checkCategoryAlreadyExist,
  categoriesController.postCategories
);

// games routes
router.post(
  "/games",
  gamesMiddleware.validateBody,
  gamesMiddleware.checkCategoryIdExist,
  gamesMiddleware.checkNameAlreadyExist,
  gamesController.postGame
);
router.get("/games", gamesMiddleware.validateQuery, gamesController.getGames);

// customers routes
router.post(
  "/customers",
  customersMiddleware.validateBody,
  customersMiddleware.checkCpfAlreadyExist,
  customersController.postCustomer
);
router.get("/customers", () => console.log("get"));
router.get("/customers/:id", () => console.log("get id"));
router.put("/customers", () => console.log("put"));

export default router;
