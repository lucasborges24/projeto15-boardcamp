import { categories } from "../models/index.js";
import { stripHtml } from "string-strip-html";

export const validateBody = (req, res, next) => {
  const validationBefore = categories.categoriesSchema.validate(req.body);
  if (validationBefore.error) {
    return res.status(400).send("Some error with JSON body");
  }

  const name = {
    name: stripHtml(validationBefore.value.name).result,
  };

  const validationAfter = categories.categoriesSchema.validate(name);
  if (validationAfter.error) {
    return res.status(400).send('Some error with JSON body envolving HTML tag');
  }

  res.locals.name = name;

  next();
  return true;
};

export const checkCategoryAlreadyExist = async (req, res, next) => {
  const { name } = res.locals.name
  try {
    const categoryExist = await categories.categoryAlreadyExist(name);
    if (categoryExist) return res.sendStatus(409)
  } catch (error) {
    res.sendStatus(500);
  }
  next();
  return true;
}
