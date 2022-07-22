import joi from "joi";
import { connection } from "./index.js";

// DATABASE
export const nameAlreadyExist = async (name) => {
  const sql = `SELECT (name) FROM games WHERE LOWER(name) = LOWER($1)`;
  const { rows: nameExist } = await connection.query(sql, [name]);
  if (nameExist && nameExist.length !== 0) {
    return true;
  }
  return false;
};

export const categoryIdExist = async (id) => {
  const sql = `SELECT *
    FROM games
    JOIN categories
    ON games."categoryId" = categories.id
    AND games."categoryId" = $1`;
  const { rows: existCategoryId } = await connection.query(sql, [id]);
  if (existCategoryId && existCategoryId.length !== 0) {
    return true;
  }
  return false;
};

export const postGame = async (game) => {
  const sql = `INSERT INTO games ("name", image, "stockTotal", "categoryId", "pricePerDay")
    VALUES ($1, $2, $3, $4, $5)`;
  await connection.query(sql, game);
};

// SCHEMAS
export const gameSchema = joi.object({
  name: joi.string().trim().lowercase().required(),
  image: joi
    .string()
    .pattern(
      /(?:(?:https?)+\:\/\/+[a-zA-Z0-9\/\._-]{1,})+(?:(?:jpe?g|png|gif))/ims
    )
    .required(),
  stockTotal: joi.number().integer().min(0).required(),
  categoryId: joi.number().integer().min(0).required(),
  pricePerDay: joi.number().integer().min(0).required(),
});
