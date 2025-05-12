import express from "express";
import { Comment as model } from "../models/comment.model.js";
import { successResponse, errorResponse } from "../utils/response.utils.js";
import { Authorize, getUserFromToken } from "../utils/auth.utils.js";
import { Recipe } from "../models/recipe.model.js";

export const commentController = express.Router();
const url = "comments";

commentController.post(`/${url}`, Authorize, async (req, res) => {
  try {
    const userId = await getUserFromToken(req, res);
    const data = req.body;
    data.user_id = userId;

    const recipe = await Recipe.findOne({
      where: { id: data.recipe_id },
    });

    if (!recipe) {
      return errorResponse(
        res,
        `Error creating comment: Recipe with id: ${data.recipe_id} not found`
      );
    }

    const result = await model.create(data);

    successResponse(res, result, "Comment created");
  } catch (err) {
    errorResponse(res, `Error in creating comment: ${err.message}`, err);
  }
});

commentController.patch(`/${url}`, Authorize, async (req, res) => {
  try {
    const userId = await getUserFromToken(req, res);
    const data = req.body;
    data.user_id = userId;

    const [updated] = await model.update(data, {
      where: { user_id: userId },
    });

    if (!updated) {
      return errorResponse(res, `Comment with id: ${data.id} not found`);
    }

    successResponse(res, { ...data }, "Comment updated");
  } catch (err) {
    errorResponse(res, `Error in updating comment: ${err.message}`, err);
  }
});

commentController.delete(`/${url}/:id`, Authorize, async (req, res) => {
  try {
    const userId = await getUserFromToken(req, res);
    const { id } = req.params;

    const result = await model.destroy({
      where: { id: id, user_id: userId },
    });

    if (!result) {
      return errorResponse(res, `Comment with id: ${id} not found`);
    }

    successResponse(res, "Comment deleted successfully");
  } catch (err) {
    errorResponse(res, `Error in deleting comment: ${err.message}`, err);
  }
});
