import { sequelize } from "../config/sequelize.config.js";
import { DataTypes, Model } from "sequelize";

export class Difficulty extends Model {}

Difficulty.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "difficulty",
    underscored: true,
    freezeTableName: true,
    indexes: [{ unique: true, fields: ["name", "slug"] }],
  }
);
