import { sequelize } from "../config/sequelize.config.js";
import { DataTypes, Model } from "sequelize";
import { Image } from "./image.model.js";
import { Recipe } from "./recipe.model.js";

export class ImageRel extends Model {}

ImageRel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    image_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Image,
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
  {
    sequelize,
    modelName: "image_rel",
    underscored: true,
    freezeTableName: true,
  }
);
