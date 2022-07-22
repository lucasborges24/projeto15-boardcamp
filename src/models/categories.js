import joi from "joi";
import { connection } from "./index.js";

// DATABASE
export const getCategories = async () => {
  const sql = "SELECT * FROM categories";
  const categories = await connection.query(sql);
  return categories.rows;
};

export const categoryAlreadyExist = async (name) => {
  const sql = `SELECT (name) FROM categories WHERE name = $1`;
  const { rows: categoryExist } = await connection.query(sql, [name]);
  if (categoryExist && categoryExist.length !== 0) {
    return true;
  }
  return false;
};

export const postCategories = async (name) => {
  const sql = `INSERT INTO categories (name) VALUES ($1)`;
  await connection.query(sql, [name]);
};

// SCHEMAS
export const categoriesSchema = joi.object({
  name: joi.string().trim().lowercase().required(),
});
