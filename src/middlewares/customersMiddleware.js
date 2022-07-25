import { customers } from "../models/index.js";
import { stripHtml } from "string-strip-html";

export const validateBody = (req, res, next) => {
  const validationBefore = customers.customersSchema.validate(req.body);
  if (validationBefore.error) {
    return res.status(400).send("Some error with JSON body");
  }

  const customer = {
    name: stripHtml(validationBefore.value.name).result,
    phone: validationBefore.value.phone,
    cpf: validationBefore.value.cpf,
    birthday: validationBefore.value.birthday,
  };

  const validationAfter = customers.customersSchema.validate(customer);
  if (validationAfter.error) {
    return res.status(400).send("Some error with JSON body envolving HTML tag");
  }

  res.locals.customer = customer;
  next();
  return true;
};

export const checkCpfAlreadyExist = async (req, res, next) => {
  const { cpf } = res.locals.customer;
  try {
    const cpfExist = await customers.cpfAlreadyExist(cpf);
    if (cpfExist) return res.sendStatus(409);
  } catch (error) {
    res.sendStatus(500);
  }
  next();
  return true;
};

export const validateCpfQuery = (req, res, next) => {
  const cpfWasSent = req.query.cpf;
  if (!cpfWasSent) {
    res.locals.cpf = "";
    next();
  } else {
    const validation = customers.cpfSchema.validate(req.query);
    if (validation.error) {
      return res.status(400).send("Some error with cpf query");
    }
    res.locals.cpf = validation.value.cpf;
    next();
  }
  return true;
};

export const validateIdParams = (req, res, next) => {
  const idWasSent = req.params.id;
  if (!idWasSent) return res.sendStatus(404);

  const validation = customers.idSchema.validate({ id: req.params.id });
  if (validation.error) return res.sendStatus(400);
  
  res.locals.id = req.params.id;
  next();
  return true;
};
