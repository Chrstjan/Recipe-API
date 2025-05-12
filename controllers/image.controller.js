import express from "express";
import { Image as model } from "../models/image.model.js";
import { successResponse, errorResponse } from "../utils/response.utils.js";
import { Authorize, getUserFromToken } from "../utils/auth.utils.js";

export const imageController = express.Router();
const url = "images";

imageController.post(`/${url}`, Authorize, async (req, res) => {
  try {
    const userId = await getUserFromToken(req, res);
    const data = req.body;
    data.user_id = userId;

    const result = await model.create(data);

    if (!result) {
      return errorResponse(res, `Error in uploading image`);
    }

    successResponse(res, result, "Image uploaded", 201);
  } catch (err) {
    errorResponse(res, `Error in creating image: ${err.message}`, err);
  }
});

imageController.delete(`/${url}/:id`, Authorize, async (req, res) => {
  try {
    const userId = await getUserFromToken(req, res);
    const { id } = req.params;

    const result = await model.destroy({
      where: { id: id, user_id: userId },
    });

    if (!result) {
      return errorResponse(res, `Image with id: ${id} not found`);
    }

    successResponse(res, "Image deleted successfully");
  } catch (err) {
    errorResponse(res, `Error in deleting image: ${err.message}`, err);
  }
});
