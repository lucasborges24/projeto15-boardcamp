import { categories } from "../models/index.js";

export const getCategories = async (req, res) => {
  try {
    const categoriesName = await categories.getCategories();
    res.send(categoriesName);
  } catch (error) {
    res.sendStatus(500);
  }
};
