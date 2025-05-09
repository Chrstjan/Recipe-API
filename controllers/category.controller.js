import express from "express"
import { Category as model } from "../models/category.model.js"
import { getQueryAttributes, getQueryLimit } from "../utils/query.utils.js";
import { successResponse, errorResponse } from "../utils/response.utils.js"

export const categoryController = express.Router();
const url = "categories"

categoryController.get(`/${url}`, async (req, res) => {
    try {
        const result = await model.findAll({
            attributes: getQueryAttributes(req.query, "id,name,slug,image"),
            limit: getQueryLimit(req.query)
        })

        if (!result || result.length === 0) {
            errorResponse(res, `No categories found`, 404);
        }

        successResponse(res, result);
    }
    catch (err) {
        errorResponse(res, `Error fetching categories: ${err.message}`, err)
    }
})

categoryController.get(`/${url}/:slug`, async (req, res) => {
    try {
        const { slug } = req.params;

        const result = await model.findOne({
            where: { slug: slug },
            attributes: getQueryAttributes(req.query, "id,name,slug,image"),
        });

        if (!result) {
            errorResponse(res, `Could not find category with slug: ${slug}`, 404)
        }

        successResponse(res, result);
    }
    catch (err) {
        errorResponse(res, `Error fetching category: ${err.message}`, err)
    }
})