import express from "express";
import { Op } from "sequelize";
import { Recipe as model } from "../models/recipe.model.js";
import {
  getQueryAttributes,
  getQueryLimit,
  getQueryOrder,
} from "../utils/query.utils.js";
import { successResponse, errorResponse } from "../utils/response.utils.js";
import { ImageRel } from "../models/image_rel.model.js";
import { Image } from "../models/image.model.js";

export const searchController = express.Router();
const url = "search";

searchController.get(`/${url}/:param`, async (req, res) => {
  try {
    const { param } = req.params;

    const result = await model.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${param}%` } },
          { slug: { [Op.like]: `%${param}%` } },
          { description: { [Op.like]: `%${param}%` } },
        ],
      },
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
          attributes: getQueryAttributes({}, "id,recipe_id", "image_rel"),
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
    });

    if (!result) {
      return errorResponse(res, `No results found for: '${param}'`);
    }

    successResponse(res, result);
  } catch (err) {
    errorResponse(res, `Error in getting search result: ${err.message}`, err);
  }
});
