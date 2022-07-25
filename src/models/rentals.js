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

export const getRentalsByGameIdAndCustomerId = async (customerId, gameId) => {
  const customerIdOp = customerId === 0 ? `>` : `=`;
  const gameIdOp = gameId === 0 ? `>` : `=`;
  const sql = `SELECT rentals.*, row_to_json(customer) AS customer, row_to_json(game) AS game
    FROM rentals
    JOIN (
      SELECT "id", "name"
      FROM customers
    ) AS customer
    ON rentals."customerId" = customer."id"
    JOIN (
      SELECT games."id", games."name", games."categoryId", categories."name" AS "categoryName"
      FROM games
      JOIN categories
      ON categories."id" = games."categoryId"
    ) AS game
    ON rentals."gameId" = game."id"
    WHERE rentals."customerId" ${customerIdOp} $1
    AND rentals."gameId" ${gameIdOp} $2`;

  const { rows: rentalsList } = await connection.query(sql, [
    customerId,
    gameId,
  ]);
  return rentalsList;
};

export const getRentalById = async (id) => {
  const sql = `SELECT * 
    FROM rentals
    WHERE "id" = $1;`;
  const { rows: rentalExist } = await connection.query(sql, [id]);
  return rentalExist;
};

export const getReturnDateById = async (id) => {
  const sql = `SELECT "returnDate" 
    FROM rentals
    WHERE "id" = $1;`;
  const { rows: returnDateArray } = await connection.query(sql, [id]);
  const { returnDate } = returnDateArray[0];
  return returnDate;
};

export const updateRentalFinished = async (id, rental) => {
    const { returnDate, delayFee } = rental
    const sql = `UPDATE rentals
    SET "returnDate" = $1, "delayFee" = $2
    WHERE "id" = $3;`
    const updated = await connection.query(sql, [returnDate, delayFee, id])
    console.log(returnDate)
    return updated;
}

// SCHEMAS

export const bodySchema = joi.object({
  customerId: joi.number().integer().min(0).required(),
  gameId: joi.number().integer().min(0).required(),
  daysRented: joi.number().integer().min(0).required(),
});

export const querySchemaGame = joi.object({
  gameId: joi.number().integer().min(0).required(),
});

export const querySchemaCustomer = joi.object({
  customerId: joi.number().integer().min(0).required(),
});
