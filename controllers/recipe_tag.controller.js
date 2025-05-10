import express from "express"
import { RecipeTag as model } from "../models/recipe_tag.model.js"
import { Authorize, getUserFromToken } from "../utils/auth.utils.js";
import { successResponse, errorResponse } from "../utils/response.utils.js";
import { Recipe } from "../models/recipe.model.js";
import { Tag } from "../models/tag.model.js";

export const recipeTagController = express.Router();
const url = "recipe-tag";

recipeTagController.post(`/${url}`, Authorize, async (req, res) => {
    try {
        const userId = await getUserFromToken(req, res);
        const data = req.body;

        const recipe = await Recipe.findOne({
            where: { id: data.recipe_id, user_id: userId }
        });

        const tag = await Tag.findOne({
            where: { id: data.tag_id }
        });

        if (!recipe || !tag) {
            return errorResponse(res, `Error in adding tag to recipe`);
        }

        const alreadyHasTag = await model.findOne({
            where: { recipe_id: data.recipe_id, tag_id: data.tag_id }
        });

        if (alreadyHasTag) {
            return errorResponse(res, `Recipe alrady has tag with id: ${data.tag_id}`);
        }

        const result = await model.create(data);

        successResponse(res, result, 201);
    }
    catch (err) {
        errorResponse(res, `Error in adding tag to recipe: ${err.message}`, err);
    } 
});

recipeTagController.delete(`/${url}/:recipeId/:id`, Authorize, async (req, res) => {
    try {
        const userId = await getUserFromToken(req, res);
        const { recipeId, id } = req.params;

        const recipe = await Recipe.findOne({
            where: { id: recipeId,  user_id: userId }
        });

        if (!recipe) {
            return errorResponse(res, `Recipe with id: ${recipeId} does not belong to user or not found`)
        }

        const result = await model.destroy({
            where: { id: id,  recipe_id: recipeId, }
        });

        if (!result) {
            return errorResponse(res, `Error in deleting tag with id: ${id} from recipe with id: ${recipeId}`)
        }

        successResponse(res, "Tag removed from recipe");
    }
    catch (err) {
        errorResponse(res, `Error in deleting tag from recipe: ${err.message}`, err);
    }
})