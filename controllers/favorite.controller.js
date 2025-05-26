import express from "express";
import { Favorite as model } from "../models/favorite.model.js";
import { Authorize, getUserFromToken } from "../utils/auth.utils.js";
import { successResponse, errorResponse } from "../utils/response.utils.js";
import { Recipe } from "../models/recipe.model.js";

export const favoriteController = express.Router();
const url = "favorites";

favoriteController.post(`/${url}/:id`, Authorize, async (req, res) => {
  try {
    const userId = await getUserFromToken(req, res);
    const { id } = req.params;

    const recipe = await Recipe.findOne({
      where: { id: id },
    });

    if (!recipe) {
      return errorResponse(res, `Recipe with id: ${id} not found`, 404);
    }

    const alreadyExists = await model.findOne({
      where: { recipe_id: id, user_id: userId },
    });

    if (alreadyExists) {
      return errorResponse(
        res,
        `Recipe with id ${id} is already in your favorites`
      );
    }

    const result = await model.create({
      recipe_id: id,
      user_id: userId,
    });

    if (!result) {
      return errorResponse(
        res,
        `Error in adding recipe with id: ${id} to favorites`
      );
    }

    successResponse(res, result, "Recipe added to favorites");
  } catch (err) {
    errorResponse(res, `Error in creating favorite: ${err.message}`, err);
  }
});

favoriteController.delete(`/${url}/:id`, Authorize, async (req, res) => {
  try {
    const userId = await getUserFromToken(req, res);
    const { id } = req.params;

    const result = await model.destroy({
      where: { id: id, user_id: userId },
    });

    if (!result) {
      return errorResponse(res, `Favorite with id: ${id} not found`);
    }

    successResponse(res, `Recipe removed from favorites`);
  } catch (err) {
    errorResponse(res, `Error in deleting favorite: ${err.message}`, err);
  }
});
