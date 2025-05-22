import express from "express";
import { Op } from "sequelize";
import { Recipe as model } from "../models/recipe.model.js";
import { getQueryAttributes, getQueryLimit } from "../utils/query.utils.js";
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
        "id,name,slug,description,prep_time,cook_time,servings,carbs,protein,calories"
      ),
      limit: getQueryLimit(req.query),
      include: [
        {
          model: ImageRel,
          as: "images",
          attributes: getQueryAttributes({}, "id,recipe_id"),
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

    if (!result) {
      return errorResponse(res, `No results found for: '${param}'`);
    }

    successResponse(res, result);
  } catch (err) {
    errorResponse(res, `Error in getting search result: ${err.message}`, err);
  }
});
