import { sequelize } from "../config/sequelize.config.js";
import { DataTypes, Model } from "sequelize";
import { User } from "./user.model.js";
import { Category } from "./category.model.js";
import { Cuisine } from "./cuisine.model.js";
import { Difficulty } from "./difficulty.model.js";

export class Recipe extends Model {}

Recipe.init(
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
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Category,
        key: "id",
      },
    },
    cuisine_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Cuisine,
        key: "id",
      },
    },
    prep_time: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    cook_time: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    servings: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    calories: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    carbs: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fat: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    protein: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    difficulty_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Difficulty,
        key: "id",
      },
    },
    rating: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "recipe",
    underscored: true,
    freezeTableName: true,
    timestamps: true,
  }
);
