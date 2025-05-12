import express from "express";
import { ImageRel as model } from "../models/image_rel.model.js";
import { successResponse, errorResponse } from "../utils/response.utils.js";
import { Authorize, getUserFromToken } from "../utils/auth.utils.js";
import { Recipe } from "../models/recipe.model.js";
import { Image } from "../models/image.model.js";

export const imageRelController = express.Router();
const url = "recipe-images";

imageRelController.post(`/${url}`, Authorize, async (req, res) => {
  try {
    const userId = await getUserFromToken(req, res);
    const data = req.body;

    const recipe = await Recipe.findOne({
      where: { id: data.recipe_id, user_id: userId },
    });

    const image = await Image.findOne({
      where: { id: data.image_id, user_id: userId },
    });

    if (!recipe) {
      return errorResponse(res, `Recipe with id: ${data.recipe_id} not found`);
    }

    if (!image) {
      return errorResponse(res, `Image with id: ${data.image_id} not found`);
    }

    const result = await model.create(data);

    successResponse(res, result, "Image added to recipe", 201);
  } catch (err) {
    errorResponse(
      res,
      `Error in creating recipe / image relation: ${err.message}`,
      err
    );
  }
});

imageRelController.delete(
  `/${url}/:recipeId/:id`,
  Authorize,
  async (req, res) => {
    try {
      const userId = await getUserFromToken(req, res);
      const { recipeId, id } = req.params;

      const recipe = await Image.findOne({
        where: { id: recipeId, user_id: userId },
      });

      if (!recipe) {
        return errorResponse(res, `Recipe with id: ${recipeId} not found`);
      }

      const result = await model.destroy({
        where: { id: id, recipe_id: recipeId },
      });

      if (!result) {
        return errorResponse(
          res,
          `You do not have permission to delete relation to recipe with id: ${recipeId}`
        );
      }

      successResponse(res, "Image removed from recipe");
    } catch (err) {
      errorResponse(
        res,
        `Error in deleting recipe / image relation: ${err.message}`,
        err
      );
    }
  }
);
