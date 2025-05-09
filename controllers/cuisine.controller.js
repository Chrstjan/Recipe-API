import express from "express"
import { Cuisine as model } from "../models/cuisine.model.js"
import { getQueryAttributes, getQueryLimit } from "../utils/query.utils.js";
import { successResponse, errorResponse } from "../utils/response.utils.js"

export const cuisineController = express.Router();
const url = "cuisine"

cuisineController.get(`/${url}`, async (req, res) => {
    try {
        const result = await model.findAll({
            attributes: getQueryAttributes(req.query, "id,name,slug"),
            limit: getQueryLimit(req.query)
        });

        if (!result || result.length === 0) {
            errorResponse(res, 'No cuisine found', 404);
        }

        successResponse(res, result);
    }
    catch (err) {
        errorResponse(res, `Error fetching cuisine: ${err.message}`, err)
    }
})

cuisineController.get(`/${url}/:slug`, async (req, res) => {
    try {
        const { slug } = req.params;

        const result = await model.findOne({
            where: { slug: slug },
            attributes: getQueryAttributes(req.query, "id,name,slug"),
        })

        if (!result) {
            errorResponse(res, `Could not find cuisine with slug: ${slug}`, 404);
        }

        successResponse(res, result);
    }
    catch (err) {
        errorResponse(res, `Error fetching category: ${err.message}`, err)
    }
})