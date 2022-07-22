import { categories } from "../models/index.js";

export const getCategories = async (req, res) => {
  try {
    const categoriesName = await categories.getCategories();
    res.send(categoriesName);
  } catch (error) {
    res.sendStatus(500);
  }
};

export const postCategories = async (req, res) => {
  const { name } = res.locals.name;
  try {
    await categories.postCategories(name);
    res.sendStatus(201);
  } catch (error) {
    res.sendStatus(500);
  }
};
