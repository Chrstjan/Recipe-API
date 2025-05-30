import express from "express";
import { Tag as model } from "../models/tag.model.js";
import {
  getQueryAttributes,
  getQueryLimit,
  getQueryOrder,
} from "../utils/query.utils.js";
import { successResponse, errorResponse } from "../utils/response.utils.js";
import { Recipe } from "../models/recipe.model.js";
import { RecipeTag } from "../models/recipe_tag.model.js";
import { ImageRel } from "../models/image_rel.model.js";
import { Image } from "../models/image.model.js";

export const tagController = express.Router();
const url = "tags";

tagController.get(`/${url}`, async (req, res) => {
  try {
    const result = await model.findAll({
      attributes: getQueryAttributes(req.query, "id,name,slug", "tag"),
      order: getQueryOrder(req.query, "tag"),
      limit: getQueryLimit(req.query, "tag"),
    });

    if (!result || result.length === 0) {
      errorResponse(res, "No tags found", 404);
    }

    successResponse(res, result);
  } catch (err) {
    errorResponse(res, `Error fetching tags: ${err.message}`, err);
  }
});

tagController.get(`/${url}/:slug`, async (req, res) => {
  try {
    const { slug } = req.params;

    const result = await model.findOne({
      where: { slug: slug },
      attributes: getQueryAttributes(req.query, "id,name,slug", "tag"),
      order: getQueryOrder(req.query, "tag"),
      limit: getQueryLimit(req.query, "tag"),
      include: [
        {
          model: RecipeTag,
          as: "recipe_tag",
          attributes: getQueryAttributes(req.query, "id,tag_id", "recipe_tag"),
          order: getQueryOrder(req.query, "recipe_tag"),
          limit: getQueryLimit(req.query, "recipe_tag"),
          include: [
            {
              model: Recipe,
              as: "recipes",
              attributes: getQueryAttributes(
                req.query,
                "id,name,slug,description,prep_time,cook_time,servings,carbs,protein,calories",
                "recipe"
              ),
              order: getQueryOrder(req.query, "recipe"),
              limit: getQueryLimit(req.query, "recipe"),
              include: [
                {
                  model: ImageRel,
                  as: "images",
                  attributes: getQueryAttributes(
                    req.query,
                    "id,recipe_id",
                    "image_rel"
                  ),
                  order: getQueryOrder(req.query, "image_rel"),
                  include: [
                    {
                      model: Image,
                      as: "image",
                      attributes: getQueryAttributes(
                        req.query,
                        "id,filename, description, is_main",
                        "image"
                      ),
                      order: getQueryOrder(req.query, "image"),
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });

    if (!result) {
      errorResponse(res, `Could not find tag with slug: ${slug}`, 404);
    }

    successResponse(res, result);
  } catch (err) {
    errorResponse(res, `Error fetching tag: ${err.message}`, err);
  }
});
