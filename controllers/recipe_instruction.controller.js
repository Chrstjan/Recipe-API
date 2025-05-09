import express from "express"
import { RecipeIngredient as model } from "../models/recipe_ingredient.model.js"
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
            where: {id: data.recipe_id, user_id: userId }
        })

        if (!recipe) {
            errorResponse(res, `Recipe with id: ${data.recipe_id} not found`, 404);
        }

        const result = await model.create(data);

        if (!result) {
            errorResponse(res, `Error in creating recipe instruction for recipe with id: ${data.recipe_id}`, 500);
        }

        successResponse(res, result, 201);
    }
    catch (err) {
        errorResponse(res, `Error in creating recipe instruction: ${err.message}`, err);
    }
})