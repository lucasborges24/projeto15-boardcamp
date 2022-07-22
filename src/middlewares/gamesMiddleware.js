import { games } from "../models/index.js";
import { stripHtml } from "string-strip-html";

export const validateBody = (req, res, next) => {
  const validationBefore = games.gameSchema.validate(req.body);
  if (validationBefore.error) {
    return res.status(400).send("Some error with JSON body");
  }

  const game = {
    name: stripHtml(validationBefore.value.name).result,
    image: stripHtml(validationBefore.value.image).result,
    stockTotal: validationBefore.value.stockTotal,
    categoryId: validationBefore.value.categoryId,
    pricePerDay: validationBefore.value.pricePerDay,
  };

  const validationAfter = games.gameSchema.validate(game);
  if (validationAfter.error) {
    return res.status(400).send("Some error with JSON body envolving HTML tag");
  }

  res.locals.game = game;
  next();
  return true;
};

export const checkNameAlreadyExist = async (req, res, next) => {
  const { name } = res.locals.game;
  try {
    const nameExist = await games.nameAlreadyExist(name);
    if (nameExist) return res.sendStatus(409);
  } catch (error) {
    res.sendStatus(500);
  }
  next();
  return true;
};

export const checkCategoryIdExist = async (req, res, next) => {
  const { categoryId } = res.locals.game;
  try {
    const categoryIdExist = await games.categoryIdExist(categoryId);
    if (!categoryIdExist) return res.sendStatus(400);
  } catch (error) {
    res.sendStatus(500);
  }
  next();
  return true;
};

export const validateQuery = (req, res, next) => {
  const nameExists = req.query.name;
  if (!nameExists) {
    res.locals.name = "";
    next();
  } else {
    const validationBefore = games.querySchema.validate({ name: nameExists });
    if (validationBefore.error)
      return res.status(400).send("Some error with query string");
    const name = {
      name: stripHtml(validationBefore.value.name).result,
    };

    const validationAfter = games.querySchema.validate(name);
    if (validationAfter.error)
      return res
        .status(400)
        .send("Some error with query string envolving HTML tag");
    res.locals.name = name.name;
    next();
  }

  return true;
};
