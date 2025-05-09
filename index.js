import express from "express";
import dotenv from "dotenv";
import { dbController } from "./controllers/db.controller.js";
import { authController } from "./controllers/auth.controller.js";
import { setRelations } from "./models/relations.js";
import { userController } from "./controllers/user.controller.js";
import { categoryController } from "./controllers/category.controller.js";
import { cuisineController } from "./controllers/cuisine.controller.js";
import { difficultyController } from "./controllers/difficulty.controller.js";
import { tagController } from "./controllers/tag.controller.js";
import { recipeController } from "./controllers/recipe.controller.js";
import { recipeIngredientController } from "./controllers/recipe_ingredient.controller.js";
import { recipeInstructionController } from "./controllers/recipe_instruction.controller.js";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

dotenv.config();

const port = process.env.PORT;

setRelations();

app.get("/", async (req, res) => {
  res.send({ message: "recipe app api" });
});

app.use(dbController, authController, userController, categoryController, cuisineController, difficultyController, tagController, recipeController, recipeIngredientController, recipeInstructionController);

app.listen(port, () => {
  console.log(`Server live on http://localhost:${port}`);
});
