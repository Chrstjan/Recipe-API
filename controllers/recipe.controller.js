import express from "express";
import { Recipe as model } from "../models/recipe.model.js";
import { getQueryAttributes, getQueryLimit } from "../utils/query.utils.js";
import { Authorize, getUserFromToken } from "../utils/auth.utils.js";
import { successResponse, errorResponse } from "../utils/response.utils.js";
import { Category } from "../models/category.model.js";
import { Cuisine } from "../models/cuisine.model.js";
import { Difficulty } from "../models/difficulty.model.js";
import { Tag } from "../models/tag.model.js";
import { RecipeTag } from "../models/recipe_tag.model.js";
import { User } from "../models/user.model.js";
import { Comment } from "../models/comment.model.js";
import { RecipeIngredient } from "../models/recipe_ingredient.model.js";
import { RecipeInstruction } from "../models/recipe_instruction.model.js";
import { Image } from "../models/image.model.js";
import { ImageRel } from "../models/image_rel.model.js";

export const recipeController = express.Router();
const url = "recipes";

recipeController.get(`/${url}`, async (req, res) => {
  try {
    const result = await model.findAll({
      attributes: getQueryAttributes(
        req.query,
        "id,name,slug,description,prep_time,cook_time,servings,carbs,protein,calories,rating"
      ),
      limit: getQueryLimit(req.query),
      include: [
        {
          model: Category,
          as: "category",
          attributes: getQueryAttributes(req.query, "name,slug"),
        },
        {
          model: Cuisine,
          as: "cuisine",
          attributes: getQueryAttributes(req.query, "name,slug"),
        },
        {
          model: Difficulty,
          as: "difficulty",
          attributes: getQueryAttributes(req.query, "name,slug"),
        },
        {
          model: RecipeTag,
          as: "tags",
          attributes: getQueryAttributes({}, "recipe_id"),
          include: [
            {
              model: Tag,
              as: "tag",
              attributes: getQueryAttributes(req.query, "name,slug"),
            },
          ],
        },
        {
          model: ImageRel,
          as: "images",
          attributes: getQueryAttributes({}, "recipe_id"),
          include: [
            {
              model: Image,
              as: "image",
              attributes: getQueryAttributes(
                {},
                "id,filename, description, is_main"
              ),
            },
          ],
        },
      ],
    });

    if (!result || result.length === 0) {
      errorResponse(res, "Could not find recipes", 404);
    }

    successResponse(res, result);
  } catch (err) {
    errorResponse(res, `Error fetching recipes: ${err.message}`, err);
  }
});

recipeController.get(`/${url}/:slug`, async (req, res) => {
  try {
    const { slug } = req.params;

    const result = await model.findOne({
      where: { slug: slug },
      attributes: getQueryAttributes(
        req.query,
        "id,name,description,prep_time,cook_time,servings,calories,carbs,fat,protein,rating"
      ),
      include: [
        {
          model: User,
          as: "creator",
          attributes: getQueryAttributes({}, "username,avatar"),
        },
        {
          model: Category,
          as: "category",
          attributes: getQueryAttributes(req.query, "name,slug"),
        },
        {
          model: Cuisine,
          as: "cuisine",
          attributes: getQueryAttributes(req.query, "name,slug"),
        },
        {
          model: Difficulty,
          as: "difficulty",
          attributes: getQueryAttributes(req.query, "name,slug"),
        },
        {
          model: RecipeTag,
          as: "tags",
          attributes: getQueryAttributes({}, "recipe_id"),
          include: [
            {
              model: Tag,
              as: "tag",
              attributes: getQueryAttributes(req.query, "name,slug"),
            },
          ],
        },
        {
          model: ImageRel,
          as: "images",
          attributes: getQueryAttributes({}, "recipe_id"),
          include: [
            {
              model: Image,
              as: "image",
              attributes: getQueryAttributes(
                {},
                "filename, description, is_main"
              ),
            },
          ],
        },
        {
          model: RecipeIngredient,
          as: "ingredients",
          attributes: getQueryAttributes({}, "name,amount"),
        },
        {
          model: RecipeInstruction,
          as: "instructions",
          attributes: getQueryAttributes({}, "step"),
        },
        {
          model: Comment,
          as: "comments",
          attributes: getQueryAttributes({}, "id,subject,content"),
          include: [
            {
              model: User,
              as: "user",
              attributes: getQueryAttributes({}, "id,username,avatar"),
            },
          ],
        },
      ],
    });

    if (!result) {
      errorResponse(res, `Could not find recipe with slug: ${slug}`, 404);
    }

    successResponse(res, result);
  } catch (err) {
    errorResponse(res, `Error fetching recipe: ${err.message}`, err);
  }
});

recipeController.post(`/${url}`, Authorize, async (req, res) => {
  try {
    const userId = await getUserFromToken(req, res);
    const data = req.body;

    data.user_id = userId;

    const doesNameExists = await model.findAll({
      where: { name: data.name },
    });

    if (doesNameExists) {
      data.slug = data.name.replaceAll(
        " ",
        "-".toLowerCase() + doesNameExists.length
      );
    } else {
      data.slug = data.name.replaceAll("", "-").toLowerCase();
    }

    const result = await model.create(data);

    if (!result) {
      errorResponse(res, "Error in creating recipe", result);
    }

    successResponse(res, result, 201);
  } catch (err) {
    errorResponse(res, `Error creating recipe: ${err.message}`, err);
  }
});

recipeController.patch(`/${url}/:id`, Authorize, async (req, res) => {
  try {
    const userId = await getUserFromToken(req, res);
    const data = req.body;
    const { id } = req.params;

    data.user_id = userId;
    data.slug = data.name.replace(" ", "-").toLowerCase();

    const [updated] = await model.update(data, {
      where: { id: id, user_id: data.user_id },
    });

    if (!updated) {
      errorResponse(res, `Error in updating recipe with id: ${id}`);
    }

    successResponse(res, { ...data }, "Recipe updated successfully");
  } catch (err) {
    errorResponse(res, `Error in updating recipe: ${err.message}`, err);
  }
});

recipeController.delete(`/${url}/:id`, Authorize, async (req, res) => {
  try {
    const userId = await getUserFromToken(req, res);
    const { id } = req.params;

    const result = await model.destroy({
      where: { id: id, user_id: userId },
    });

    if (!result) {
      errorResponse(res, `Error in deleting recipe with id: ${id}`, result);
    }

    successResponse(res, `Recipe with id: ${id} deleted successfully`);
  } catch (err) {
    errorResponse(res, `Error in deleting recipe: ${err.message}`, err);
  }
});
