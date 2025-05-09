import express from "express"
import { Recipe as model } from "../models/recipe.model.js"
import { getQueryAttributes, getQueryLimit } from "../utils/query.utils.js";
import { successResponse, errorResponse } from "../utils/response.utils.js";
import { Category } from "../models/category.model.js";
import { Cuisine } from "../models/cuisine.model.js";
import { Difficulty } from "../models/difficulty.model.js";
import { Tag } from "../models/tag.model.js";
import { RecipeTag } from "../models/recipe_tag.model.js";
import { User } from "../models/user.model.js";
import { Comment } from "../models/comment.model.js";

export const recipeController = express.Router();
const url = "recipes";

recipeController.get(`/${url}`, async (req, res) => {
    try {
        const result = await model.findAll({
            attributes: getQueryAttributes(req.query, "id,name,slug,description,prep_time,cook_time,servings,rating"),
            limit: getQueryLimit(req.query),
            include: [
                {
                    model: Category,
                    as: "category",
                    attributes: getQueryAttributes(req.query, "name,slug")
                },
                {
                    model: Cuisine,
                    as: "cuisine",
                    attributes: getQueryAttributes(req.query, "name,slug")
                },
                {
                    model: Difficulty,
                    as: "difficulty",
                    attributes: getQueryAttributes(req.query, "name,slug")
                },
                {
                    model: RecipeTag,
                    as: "tags",
                    attributes: getQueryAttributes({},"recipe_id"),
                    include: [
                        {
                            model: Tag,
                            as: "tag",
                            attributes: getQueryAttributes(req.query, "name,slug")
                        }
                    ],
                }
            ]
        });

        if (!result || result.length === 0) {
            errorResponse(res, "Could not find recipes", 404);
        }

        successResponse(res, result);
    }
    catch (err) {
        errorResponse(res, `Error fetching recipes: ${err.message}`, err)
    }
})

recipeController.get(`/${url}/:slug`, async (req, res) => {
    try {
        const { slug } = req.params;

        const result = await model.findOne({
            where: { slug: slug },
            attributes: getQueryAttributes(req.query, "id,name,description,prep_time,cook_time,servings,calories,carbs,fat,protein,rating"),
            include: [
                {
                    model: User,
                    as: "creator",
                    attributes: getQueryAttributes({},"username,avatar")
                },
                {
                    model: Category,
                    as: "category",
                    attributes: getQueryAttributes(req.query, "name,slug")
                },
                {
                    model: Cuisine,
                    as: "cuisine",
                    attributes: getQueryAttributes(req.query, "name,slug")
                },
                {
                    model: Difficulty,
                    as: "difficulty",
                    attributes: getQueryAttributes(req.query, "name,slug")
                },
                {
                    model: RecipeTag,
                    as: "tags",
                    attributes: getQueryAttributes({},"recipe_id"),
                    include: [
                        {
                            model: Tag,
                            as: "tag",
                            attributes: getQueryAttributes(req.query, "name,slug")
                        }
                    ],
                },
                {
                    model: Comment,
                    as: "comments",
                    attributes: getQueryAttributes({},"subject,content"),
                    include: [
                        {
                            model: User,
                            as: "user",
                            attributes: getQueryAttributes({}, "username,avatar")
                        }
                    ]
                }
            ]
        });

        if (!result) {
            errorResponse(res, `Could not find recipe with slug: ${slug}`, 404);
        }

        successResponse(res, result);
    }
    catch (err) {
        errorResponse(res, `Error fetching recipe: ${err.message}`, err)
    }
})