import joi from "joi";
import { connection } from "./index.js";

// DATABASE

export const getGameRentaledByGameId = async (id) => {
  const sql = `SELECT * FROM games
    JOIN rentals
    ON games."id" = rentals."gameId"
    WHERE games."id" = $1`;
  const games = await connection.query(sql, [id]);
  return games.rows;
};

export const postRental = async (rentalObject) => {
  const {
    customerId,
    gameId,
    daysRented,
    rentDate,
    returnDate,
    originalPrice,
    delayFee,
  } = rentalObject;

  const sql = `INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee") VALUES ($1, $2, $3, $4, $5, $6, $7)`;

  const posted = await connection.query(sql, [
    customerId,
    gameId,
    rentDate,
    daysRented,
    returnDate,
    originalPrice,
    delayFee,
  ]);

  return posted;
};

// SCHEMAS

export const bodySchema = joi.object({
  customerId: joi.number().integer().min(0).required(),
  gameId: joi.number().integer().min(0).required(),
  daysRented: joi.number().integer().min(0).required(),
});
