import joi from "joi";
import { connection } from "./index.js";
import joiDate from "@joi/date";
const Joi = joi.extend(joiDate);

// DATABASE

export const cpfAlreadyExist = async (cpf) => {
  const sql = `SELECT cpf
  FROM customers
  WHERE cpf = $1`;
  const { rows: cpfExist } = await connection.query(sql, [cpf]);
  if (cpfExist && cpfExist.length !== 0) {
    return true;
  }
  return false;
};

export const postCustomer = async (customer) => {
  const sql = `INSERT INTO customers ("name", "phone", cpf, birthday)
  VALUES ($1, $2, $3, $4);`;
  await connection.query(sql, customer);
};

// SCHEMAS

export const customersSchema = joi.object({
  name: joi.string().trim().required(),
  phone: joi
    .string()
    .trim()
    .pattern(/[0-9]{10,11}/)
    .required(),
  cpf: joi
    .string()
    .trim()
    .pattern(/[0-9]{11}/)
    .required(),
  birthday: Joi.date().format("YYYY-MM-DD").raw().required(),
});
