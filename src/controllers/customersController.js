import { customers } from "../models/index.js";

export const postCustomer = async (req, res) => {
  const { name, phone, cpf, birthday } = res.locals.customer;
  const customerList = [name, phone, cpf, birthday];
  try {
    await customers.postCustomer(customerList);
    res.sendStatus(201);
  } catch (error) {
    res.sendStatus(500);
  }
};
