import express from "express";
import sequelize from "../config/sequelize.config.js";
import { errorResponse, successResponse } from "../utils/response.utils.js";
import { seedFromCsv } from "../utils/seed.utils.js";
import { User } from "../models/user.model.js";
import { Category } from "../models/category.model.js";
import { Cuisine } from "../models/cuisine.model.js";
import { Difficulty } from "../models/difficulty.model.js";
import { Recipe } from "../models/recipe.model.js";
import { RecipeIngredient } from "../models/recipe_ingredient.model.js";
import { RecipeInstruction } from "../models/recipe_instruction.model.js";
import { Image } from "../models/image.model.js";
import { ImageRel } from "../models/image_rel.model.js";

export const dbController = express.Router();

dbController.get("/api", async (req, res) => {
  try {
    await sequelize.authenticate();
    successResponse(res, "DB CONNECTION", 200);
  } catch (err) {
    errorResponse(res, `Error could not find DB: ${err.message}`, 500);
  }
});

dbController.get("/sync", async (req, res) => {
  try {
    const resp = await sequelize.sync({ force: true }); //Only in dev remove before prod!!
    successResponse(res, "DB Synced", 200);
  } catch (err) {
    errorResponse(res, `Error in DB sync: ${err.message}`);
  }
});

dbController.get("/seed", async (req, res) => {
  try {
    const files_to_seed = [
      { file: "user.csv", model: User },
      { file: "category.csv", model: Category },
      { file: "cuisine.csv", model: Cuisine },
      { file: "difficulty.csv", model: Difficulty },
      { file: "recipe.csv", model: Recipe },
      { file: "recipe_ingredient.csv", model: RecipeIngredient },
      { file: "recipe_instruction.csv", model: RecipeInstruction },
      { file: "image.csv", model: Image },
      { file: "image_rel.csv", model: ImageRel },
    ];

    const files_seeded = [];

    await sequelize.sync({ force: true });

    for (let item of files_to_seed) {
      files_seeded.push(await seedFromCsv(item.file, item.model));
    }

    successResponse(res, { "Files seeded": files_seeded }, "Seeding complete");
  } catch (err) {
    errorResponse(res, `Seeding failed: ${err.message}`, err);
  }
});
