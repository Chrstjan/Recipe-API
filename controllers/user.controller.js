import express from "express";
import { User as model } from "../models/user.model.js";
import { Authorize, getUserFromToken } from "../utils/auth.utils.js";
import { successResponse, errorResponse } from "../utils/response.utils.js";
import { Recipe } from "../models/recipe.model.js";

export const userController = express.Router();
const url = "user";

userController.get(`/${url}`, Authorize, async (req, res) => {
  try {
    const userId = await getUserFromToken(req, res);

    const result = await model.findOne({
      attributes: ["username", "email", "avatar"],
      where: { id: userId },
      include: [
        {
          model: Recipe,
          as: "recipes",
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
