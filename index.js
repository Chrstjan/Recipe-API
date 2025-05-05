import express from "express";
import dotenv from "dotenv";
import { dbController } from "./controllers/db.controller.js";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

dotenv.config();

const port = process.env.PORT;

app.get("/", async (req, res) => {
  res.send({ message: "recipe app api" });
});

app.use(dbController);

app.listen(port, () => {
  console.log(`Server live on http://localhost:${port}`);
});
