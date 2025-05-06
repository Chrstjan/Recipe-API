import { sequelize } from "../config/sequelize.config.js";
import { DataTypes, Model } from "sequelize";
import { Recipe } from "./recipe.model.js";

export class RecipeInstruction extends Model {}

RecipeInstruction.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    recipe_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Recipe,
        key: "id",
      },
    },
    step: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "recipe_instruction",
    underscored: true,
    freezeTableName: true,
  }
);
