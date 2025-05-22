import { sequelize } from "../config/sequelize.config.js";
import { DataTypes, Model } from "sequelize";
import { User } from "./user.model.js";
import { Recipe } from "./recipe.model.js";

export class Favorite extends Model {}

Favorite.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    recipe_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Recipe,
        key: "id",
      },
      onDelete: "CASCADE",
    },
  },
  { sequelize, modelName: "favorite", underscored: true, freezeTableName: true }
);
