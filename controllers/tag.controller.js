import express from "express"
import { Tag as model } from "../models/tag.model.js"
import { getQueryAttributes, getQueryLimit } from "../utils/query.utils.js";
import { successResponse, errorResponse } from "../utils/response.utils.js"

export const tagController = express.Router();
const url = "tags"

tagController.get(`/${url}`, async (req, res) => {
    try {
        const result = await model.findAll({
            attributes: getQueryAttributes(req.query, "id,name,slug"),
            limit: getQueryLimit(req.query)
        });

        if (!result || result.length === 0) {
            errorResponse(res, 'No tags found', 404);
        }

        successResponse(res, result);
    }
    catch (err) {
        errorResponse(res, `Error fetching tags: ${err.message}`, err)
    }
})

tagController.get(`/${url}/:slug`, async (req, res) => {
    try {
        const { slug } = req.params;

        const result = await model.findOne({
            where: { slug: slug },
            attributes: getQueryAttributes(req.query, "id,name,slug"),
        })

        if (!result) {
            errorResponse(res, `Could not find tag with slug: ${slug}`, 404);
        }

        successResponse(res, result);
    }
    catch (err) {
        errorResponse(res, `Error fetching tag: ${err.message}`, err)
    }
})