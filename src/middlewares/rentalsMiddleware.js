import { rentals, customers } from "../models/index.js";
import { stripHtml } from "string-strip-html";

export const validateBody = (req, res, next) => {
  const validation = rentals.bodySchema.validate(req.body);
  if (validation.error) {
    return res.status(400).send("Some error with JSON body")
  }

  const rental = {
    customerId: validation.value.customerId,
    gameId: validation.value.gameId,
    daysRented: validation.value.daysRented,
  };

  res.locals.rental = rental;
  next();
  return true;
};

export const checkCustomerExistById = async (req, res, next) => {
    const { customerId } = res.locals.rental
    try {
        const customer = await customers.getCustomerById(customerId);
        if (customer && customer.length !== 0) {
          next();
          return true;
        }

        return res.sendStatus(400)
    } catch (error) {
        res.sendStatus(500)
    }
}
