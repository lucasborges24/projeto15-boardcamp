import { connection } from "./index.js";

export const getCategories = async () => {
  const categories = await connection.query('SELECT * FROM categories');
  return categories.rows;
};
