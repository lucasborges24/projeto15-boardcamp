import joi from "joi";
import { connection } from "./index.js";

// DATABASE
export const getCategories = async () => {
  const categories = await connection.query("SELECT * FROM categories");
  return categories.rows;
};

// SCHEMAS
export const categoriesSchema = joi.object({
  name: joi.string().trim().required(),
});
