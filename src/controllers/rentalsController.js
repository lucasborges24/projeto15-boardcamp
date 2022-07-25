import { rentals } from "../models/index.js";
import dayjs from "dayjs";
import moment from "moment";

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

export const getRentals = async (req, res) => {
  const customerId = res.locals.customerId;
  const gameId = res.locals.gameId;
  try {
    const rentalsList = await rentals.getRentalsByGameIdAndCustomerId(
      customerId,
      gameId
    );
    res.send(rentalsList);
  } catch (error) {
    res.sendStatus(500);
  }
};

export const updateRental = async (req, res) => {
  const { rental, id } = res.locals;
  const rentDate = moment.utc(rental.rentDate);
  const today = moment();
  const delay = today.diff(rentDate, "days");
  let fee = null;
  if (delay > 0) {
    fee = delay * (rental.originalPrice / rental.daysRented);
  }
  const rentalUpdated = {
    ...rental,
    returnDate: today.format("YYYY-MM-DD"),
    delayFee: fee,
  };

  try {
    const updated = await rentals.updateRentalFinished(id, rentalUpdated);
    if (updated) {
      return res.sendStatus(201);
    } else {
      return res.sendStatus(400);
    }
  } catch (error) {
    res.sendStatus(500);
  }
};

export const deleteRental = async (req, res) => {
    const { id } = res.locals
    try {
        const deleted = await rentals.deleteRentarById(id)
        if (deleted) {
            return res.sendStatus(200)
        } else {
            return res.sendStatus(400)
        }
    } catch (error) {
        res.sendStatus(500)
    }
}
