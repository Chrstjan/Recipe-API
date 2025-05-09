import express from "express"
import { Difficulty as model } from "../models/difficulty.model.js"
import { getQueryAttributes, getQueryLimit } from "../utils/query.utils.js";
import { successResponse, errorResponse } from "../utils/response.utils.js"

export const difficultyController = express.Router();
const url = "difficulty"

difficultyController.get(`/${url}`, async (req, res) => {
    try {
        const result = await model.findAll({
            attributes: getQueryAttributes(req.query, "id,name,slug"),
            limit: getQueryLimit(req.query)
        });

        if (!result || result.length === 0) {
            errorResponse(res, 'No difficulties found', 404);
        }

        successResponse(res, result);
    }
    catch (err) {
        errorResponse(res, `Error fetching difficulties: ${err.message}`, err)
    }
})

difficultyController.get(`/${url}/:slug`, async (req, res) => {
    try {
        const { slug } = req.params;

        const result = await model.findOne({
            where: { slug: slug },
            attributes: getQueryAttributes(req.query, "id,name,slug"),
        })

        if (!result) {
            errorResponse(res, `Could not find difficulty with slug: ${slug}`, 404);
        }

        successResponse(res, result);
    }
    catch (err) {
        errorResponse(res, `Error fetching difficulty: ${err.message}`, err)
    }
})