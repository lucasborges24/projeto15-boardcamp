import { rentals, customers, games } from "../models/index.js";
import { stripHtml } from "string-strip-html";

export const validateBody = (req, res, next) => {
  const validation = rentals.bodySchema.validate(req.body);
  if (validation.error) {
    return res.status(400).send("Some error with JSON body");
  }

  const rental = {
    customerId: validation.value.customerId,
    gameId: validation.value.gameId,
    daysRented: validation.value.daysRented,
  };

  res.locals.rental = rental;
  next();
  return true;
};

export const checkCustomerExistById = async (req, res, next) => {
  const { customerId } = res.locals.rental;
  try {
    const customer = await customers.getCustomerById(customerId);
    if (customer && customer.length !== 0) {
      next();
      return true;
    }

    return res.sendStatus(400);
  } catch (error) {
    res.sendStatus(500);
  }
};

export const checkGameExistById = async (req, res, next) => {
  const { gameId } = res.locals.rental;
  try {
    const game = await games.getGameById(gameId);
    if (game && game.length !== 0) {
      res.locals.game = game[0];
      next();
      return true;
    }

    return res.sendStatus(401);
  } catch (error) {
    res.sendStatus(500);
  }
};

export const checkGamesRentaled = async (req, res, next) => {
  const { gameId } = res.locals.rental;
  const { stockTotal } = res.locals.game;
  try {
    const gamesCount = await rentals.getGameRentaledByGameId(gameId);
    if (gamesCount.length >= stockTotal) {
      return res.sendStatus(400);
    }
    next();
  } catch (error) {
    res.sendStatus(500);
  }
};

export const validateQuery = (req, res, next) => {
  const customerId = req.query?.customerId
  const gameId = req.query?.gameId;

  if (gameId) {
    const validationGame = rentals.querySchemaGame.validate({
      gameId: Number(gameId),
    });
    if (validationGame.error) return res.sendStatus(400);
    res.locals.gameId = validationGame.value.gameId;
  } else {
    res.locals.gameId = 0;
  }

  if (customerId) {
    const validationCustomer = rentals.querySchemaCustomer.validate({
      customerId: Number(customerId),
    });
    if (validationCustomer.error) return res.sendStatus(400);
    res.locals.customerId = validationCustomer.value.customerId;
  } else {
    res.locals.customerId = 0;
  }


  next();
  return true;
};
