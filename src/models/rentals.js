import joi from "joi";
import { connection } from "./index.js";

// DATABASE



// SCHEMAS

export const bodySchema = joi.object({
  customerId: joi.number().integer().min(0).required(),
  gameId: joi.number().integer().min(0).required(),
  daysRented: joi.number().integer().min(0).required(),
});
