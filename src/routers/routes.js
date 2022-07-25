import axios from "axios";
import { Router } from "express";

import {
  categoriesController,
  gamesController,
  customersController,
  rentalsController,
} from "../controllers/index.js";

import {
  categoriesMiddleware,
  gamesMiddleware,
  customersMiddleware,
  rentalsMiddleware,
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
router.get(
  "/customers",
  customersMiddleware.validateCpfQuery,
  customersController.getCustomers
);
router.get(
  "/customers/:id",
  customersMiddleware.validateIdParams,
  customersController.getCustomerById
);
router.put(
  "/customers/:id",
  customersMiddleware.validateIdParams,
  customersMiddleware.validateBody,
  customersMiddleware.checkCpfAlreadyExist,
  customersController.updateCustomer
);

// rentals routes
router.post(
  "/rentals",
  rentalsMiddleware.validateBody,
  rentalsMiddleware.checkCustomerExistById,
  rentalsMiddleware.checkGameExistById,
  rentalsMiddleware.checkGamesRentaled,
  rentalsController.postRental
);

router.post(
  "/rentals/:id/return",
  customersMiddleware.validateIdParams,
  rentalsMiddleware.checkRentalById,
  rentalsMiddleware.checkRentalIsFinishedById,
  rentalsController.updateRental
);

router.get(
  "/rentals",
  rentalsMiddleware.validateQuery,
  rentalsController.getRentals
);

router.delete(
  "/rentals/:id",
  customersMiddleware.validateIdParams,
  rentalsMiddleware.checkRentalById,
  rentalsMiddleware.checkRentalIsNotFinishedById,
  rentalsController.deleteRental
)

export default router;
