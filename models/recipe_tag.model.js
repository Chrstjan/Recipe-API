import { sequelize } from "../config/sequelize.config.js";
import { DataTypes, Model } from "sequelize";
import { Recipe } from "./recipe.model.js";
import { Tag } from "./tag.model.js";

export class RecipeTag extends Model {}

RecipeTag.init(
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
      onDelete: "CASCADE",
    },
    tag_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Tag,
        key: "id",
      },
      onDelete: "CASCADE",
    },
  },
  {
    sequelize,
    modelName: "recipe_tag",
    underscored: true,
    freezeTableName: true,
  }
);
