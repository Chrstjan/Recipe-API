import express from "express";
import sequelize from "../config/sequelize.config.js";
import { errorResponse, successResponse } from "../utils/response.utils.js";
import { seedFromCsv } from "../utils/seed.utils.js";
import { Category } from "../models/category.model.js";

export const dbController = express.Router();

dbController.get("/api", async (req, res) => {
  try {
    await sequelize.authenticate();
    successResponse(res, "DB CONNECTION", 200);
  } catch (err) {
    errorResponse(res, `Error could not find DB: ${err.message}`, 500);
  }
});

dbController.get("/sync", async (req, res) => {
  try {
    const resp = await sequelize.sync({ force: true }); //Only in dev remove before prod!!
    successResponse(res, "DB Synced", 200);
  } catch (err) {
    errorResponse(res, `Error in DB sync: ${err.message}`);
  }
});

dbController.get("/seed", async (req, res) => {
  try {
    const files_to_seed = [{ file: "category.csv", model: Category }];

    const files_seeded = [];

    await sequelize.sync({ force: true });

    for (let item of files_to_seed) {
      files_seeded.push(await seedFromCsv(item.file, item.model));
    }

    successResponse(res, { "Files seeded": files_seeded }, "Seeding complete");
  } catch (err) {
    errorResponse(res, `Seeding failed: ${err.message}`, err);
  }
});
