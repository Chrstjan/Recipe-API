import express from "express";
import { Category as model } from "../models/category.model.js";
import {
  getQueryAttributes,
  getQueryLimit,
  getQueryOrder,
} from "../utils/query.utils.js";
import { successResponse, errorResponse } from "../utils/response.utils.js";
import { Recipe } from "../models/recipe.model.js";
import { ImageRel } from "../models/image_rel.model.js";
import { Image } from "../models/image.model.js";

export const categoryController = express.Router();
const url = "categories";

categoryController.get(`/${url}`, async (req, res) => {
  try {
    const result = await model.findAll({
      attributes: getQueryAttributes(
        req.query,
        "id,name,slug,image",
        "category"
      ),
      order: getQueryOrder(req.query, "category"),
      limit: getQueryLimit(req.query, "category"),
    });

    if (!result || result.length === 0) {
      errorResponse(res, `No categories found`, 404);
    }

    successResponse(res, result);
  } catch (err) {
    errorResponse(res, `Error fetching categories: ${err.message}`, err);
  }
});

categoryController.get(`/${url}/:slug`, async (req, res) => {
  try {
    const { slug } = req.params;

    const result = await model.findOne({
      where: { slug: slug },
      attributes: getQueryAttributes(
        req.query,
        "id,name,slug,image",
        "category"
      ),
      order: getQueryOrder(req.query, "category"),
      limit: getQueryLimit(req.query, "category"),
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
    });

    if (!result) {
      errorResponse(res, `Could not find category with slug: ${slug}`, 404);
    }

    successResponse(res, result);
  } catch (err) {
    errorResponse(res, `Error fetching category: ${err.message}`, err);
  }
});
