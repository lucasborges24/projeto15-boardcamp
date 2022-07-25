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
  VALUES ($1, $2, $3, $4)`;
  await connection.query(sql, customer);
};

export const getCustomersWithCpf = async (op) => {
  const sql = `SELECT * FROM customers WHERE cpf LIKE $1`;
  const customers = await connection.query(sql, [`${op}%`]);
  return customers.rows;
};

export const getCustomerById = async (id) => {
  const sql = `SELECT * FROM customers WHERE "id" = $1`;
  const customer = await connection.query(sql, [id]);
  return customer.rows;
};

export const updateCustomerById = async (customer) => {
  const sql = `UPDATE customers SET name = $1, phone = $2, cpf = $3, birthday = $4 WHERE id = $5`;
  const result = await connection.query(sql, customer);
  return result.rowCount;
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

export const cpfSchema = joi.object({
  cpf: joi
    .string()
    .trim()
    .pattern(/[0-9]{1,11}/)
    .required(),
});

export const idSchema = joi.object({
  id: joi
    .string()
    .trim()
    .pattern(/^[0-9]+$/)
    .required(),
});
