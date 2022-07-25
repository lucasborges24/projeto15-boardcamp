import { rentals } from "../models/index.js";
import dayjs from "dayjs";

export const postRental = async (req, res) => {
  const { rental } = res.locals;
  const { pricePerDay } = res.locals.game;

  const rentDate = dayjs().format("YYYY-MM-DD");
  const originalPrice = rental.daysRented * pricePerDay;

  const rentalObject = {
    ...rental,
    rentDate,
    returnDate: null,
    originalPrice,
    delayFee: null,
  };

  try {
    const posted = await rentals.postRental(rentalObject);
    if (posted) return res.sendStatus(201);

    return res.sendStatus(400);
  } catch (error) {
    res.sendStatus(500);
  }
};
