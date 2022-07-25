import { customers } from "../models/index.js";
import moment from "moment";

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

export const getCustomers = async (req, res) => {
  const { cpf } = res.locals;
  try {
    const customersList = await customers.getCustomersWithCpf(cpf);
    const customerListUpdated = customersList.map((item) => {
      return {
        ...item,
        birthday: moment.utc(item.birthday).format("YYYY-MM-DD"),
      };
    });
    res.send(customerListUpdated);
  } catch (error) {
    res.sendStatus(500);
  }
};

export const getCustomerById = async (req, res) => {
  const { id } = res.locals;
  try {
    const customer = await customers.getCustomerById(id);
    if (customer.length === 0) return res.sendStatus(404);

    const customerUpdated = {
      ...customer[0],
      birthday: moment.utc(customer[0].birthday).format("YYYY-MM-DD"),
    };
    res.send(customerUpdated)
  } catch (error) {
    res.sendStatus(500);
  }
};

export const updateCustomer = async (req, res) => {
  const id = res.locals.id
  console.log(id);
  const { name, phone, cpf, birthday } = res.locals.customer;
  const customerList = [name, phone, cpf, birthday, id];
  try {
    const created = await customers.updateCustomerById(customerList)
    if (created) return res.sendStatus(201)

    res.sendStatus(400);
    
  } catch (error) {
    res.sendStatus(500)
  }
}