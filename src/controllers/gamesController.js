import { games } from "../models/index.js";

export const postGame = async (req, res) => {
  const { game } = res.locals;
  const gameArray = [
    game.name,
    game.image,
    game.stockTotal,
    game.categoryId,
    game.pricePerDay,
  ];
  try {
    await games.postGame(gameArray);
    res.sendStatus(201);
  } catch (error) {
    res.sendStatus(500);
  }
};

export const getGames = async (req, res) => {
    const { name } = res.locals
    try {
        const gameList = await games.getGameWithCategoryName(name);
        res.send(gameList)
    } catch (error) {
        res.sendStatus(500);
    }
}