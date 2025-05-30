import express from "express";
import { User as model } from "../models/user.model.js";
import { Authorize, getUserFromToken } from "../utils/auth.utils.js";
import { successResponse, errorResponse } from "../utils/response.utils.js";
import {
  getQueryAttributes,
  getQueryLimit,
  getQueryOrder,
} from "../utils/query.utils.js";
import { Recipe } from "../models/recipe.model.js";
import { Category } from "../models/category.model.js";
import { Cuisine } from "../models/cuisine.model.js";
import { Difficulty } from "../models/difficulty.model.js";
import { RecipeTag } from "../models/recipe_tag.model.js";
import { Tag } from "../models/tag.model.js";
import { ImageRel } from "../models/image_rel.model.js";
import { Image } from "../models/image.model.js";
import { Comment } from "../models/comment.model.js";
import { Favorite } from "../models/favorite.model.js";

export const userController = express.Router();
const url = "user";

userController.get(`/${url}`, Authorize, async (req, res) => {
  try {
    const userId = await getUserFromToken(req, res);

    const result = await model.findOne({
      attributes: ["id", "username", "email", "avatar"],
      where: { id: userId },
      include: [
        {
          model: Recipe,
          as: "recipes",
          attributes: getQueryAttributes(
            req.query,
            "id,name,slug,description",
            "recipe"
          ),
          order: getQueryOrder(req.query, "recipe"),
          limit: getQueryLimit(req.query, "recipe"),
          include: [
            {
              model: Category,
              as: "category",
              attributes: getQueryAttributes(
                req.query,
                "id,name,slug",
                "category"
              ),
              order: getQueryOrder(req.query, "category"),
            },
            {
              model: Cuisine,
              as: "cuisine",
              attributes: getQueryAttributes(
                req.query,
                "id,name,slug",
                "cuisine"
              ),
              order: getQueryOrder(req.query, "cuisine"),
            },
            {
              model: Difficulty,
              as: "difficulty",
              attributes: getQueryAttributes(
                req.query,
                "id,name,slug",
                "difficulty"
              ),
              order: getQueryOrder(req.query, "difficulty"),
            },
            {
              model: RecipeTag,
              as: "tags",
              attributes: getQueryAttributes(
                req.query,
                "id,recipe_id",
                "recipe_tag"
              ),
              order: getQueryOrder(req.query, "recipe_tag"),
              include: [
                {
                  model: Tag,
                  as: "tag",
                  attributes: getQueryAttributes(
                    req.query,
                    "id,name,slug",
                    "tag"
                  ),
                  order: getQueryOrder(req.query, "tag"),
                },
              ],
            },
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
        {
          model: Comment,
          as: "comments",
          attributes: getQueryAttributes(
            req.query,
            "id,recipe_id,subject,content,createdAt",
            "comment"
          ),
          order: getQueryOrder(req.query, "comment"),
          limit: getQueryLimit(req.query, "comment"),
        },
        {
          model: Favorite,
          as: "favorites",
          attributes: getQueryAttributes(req.query, "id,recipe_id", "favorite"),
          order: getQueryOrder(req.query, "favorite"),
          limit: getQueryLimit(req.query, "favorite"),
          include: [
            {
              model: Recipe,
              as: "recipe",
              attributes: getQueryAttributes(
                req.query,
                "id,name,slug",
                "favorite_recipe"
              ),
              order: getQueryOrder(req.query, "favorite_recipe"),
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
        {
          model: Image,
          as: "images",
          attributes: getQueryAttributes(
            req.query,
            "id,user_id,filename, description, is_main",
            "image"
          ),
          order: getQueryOrder(req.query, "image"),
          limit: getQueryLimit(req.query, "image"),
        },
      ],
    });

    if (!result) {
      errorResponse(res, `User with the id: ${userId} not found`, 404);
    }

    successResponse(res, result, 200);
  } catch (err) {
    errorResponse(res, `Error fetching data from user: ${err.message}`, err);
  }
});

userController.post(`/${url}`, async (req, res) => {
  try {
    const data = req.body;

    let doesExist = await model.findOne({ where: { email: data.email } });

    if (doesExist) {
      errorResponse(res, `Error Account with that email already exists`);
    } else {
      const result = await model.create(data);
      successResponse(
        res,
        {
          email: result.email,
          username: result.username,
        },
        "Account created successfully",
        201
      );
    }
  } catch (err) {
    errorResponse(res, `Error in creating Account: ${err.message}`, err);
  }
});

userController.patch(`/${url}`, Authorize, async (req, res) => {
  try {
    const userId = await getUserFromToken(req, res);

    const data = req.body;

    const [updated] = await model.update(data, {
      where: { id: userId },
    });

    if (!updated) {
      errorResponse(res, `No user with the id: ${userId} found`, 404);
    }

    successResponse(res, { userId, ...data }, "User updated successfully");
  } catch (err) {
    errorResponse(res, `Error in updating user: ${err.message}`, err);
  }
});

userController.delete(`/${url}`, Authorize, async (req, res) => {
  try {
    const userId = await getUserFromToken(req, res);

    const result = await model.destroy({
      where: { id: userId },
    });

    if (!result) {
      errorResponse(res, `User with the id: ${userId} not found`, 404);
    }

    successResponse(res, `User and related recipes deleted successfully`);
  } catch (err) {
    errorResponse(res, `Error deleting user: ${err.message}`, err);
  }
});
