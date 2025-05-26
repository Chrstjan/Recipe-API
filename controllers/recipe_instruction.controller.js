import express from "express";
import { RecipeInstruction as model } from "../models/recipe_instruction.model.js";
import { Authorize, getUserFromToken } from "../utils/auth.utils.js";
import { successResponse, errorResponse } from "../utils/response.utils.js";
import { Recipe } from "../models/recipe.model.js";

export const recipeInstructionController = express.Router();
const url = "instruction";

recipeInstructionController.post(`/${url}`, Authorize, async (req, res) => {
  try {
    const userId = await getUserFromToken(req, res);
    const data = req.body;

    const recipe = await Recipe.findOne({
      where: { id: data.recipe_id, user_id: userId },
    });

    if (!recipe) {
      errorResponse(res, `Recipe with id: ${data.recipe_id} not found`, 404);
    }

    const result = await model.create(data);

    if (!result) {
      errorResponse(
        res,
        `Error in creating recipe instruction for recipe with id: ${data.recipe_id}`,
        500
      );
    }

    successResponse(res, result, 201);
  } catch (err) {
    errorResponse(
      res,
      `Error in creating recipe instruction: ${err.message}`,
      err
    );
  }
});

recipeInstructionController.patch(`/${url}`, Authorize, async (req, res) => {
  try {
    const userId = await getUserFromToken(req, res);
    const data = req.body;

    const recipe = await Recipe.findOne({
      where: { id: data.recipe_id, user_id: userId },
    });

    if (!recipe) {
      errorResponse(res, `Recipe with id: ${data.recipe_id} not found`);
    }

    const [update] = await model.update(data, {
      where: { id: data.id, recipe_id: data.recipe_id },
    });

    if (!update) {
      errorResponse(
        res,
        `Error in updating instruction: ${data.id} for recipe with id: ${data.recipe_id}`
      );
    }

    successResponse(
      res,
      { ...data },
      "Recipe instruction updated successfully"
    );
  } catch (err) {
    errorResponse(
      res,
      `Error in updating recipe instruction: ${err.message}`,
      err
    );
  }
});

recipeInstructionController.delete(
  `/${url}/:recipeId/:id`,
  Authorize,
  async (req, res) => {
    try {
      const userId = await getUserFromToken(req, res);
      const { recipeId, id } = req.params;

      const recipe = await Recipe.findOne({
        where: { id: recipeId, user_id: userId },
      });

      if (!recipe) {
        errorResponse(res, `Recipe does not belong to user with id: ${userId}`);
      }

      const result = await model.destroy({
        where: { id: id, recipe_id: recipeId },
      });

      if (!result) {
        errorResponse(res, `Error in deleting instruction with id: ${id}`);
      }

      successResponse(res, `Instruction with id: ${id} deleted successfully`);
    } catch (err) {
      errorResponse(res, `Error in deleting instruction: ${err.message}`, err);
    }
  }
);
