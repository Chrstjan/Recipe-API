import { sequelize } from "../config/sequelize.config.js";
import { DataTypes, Model } from "sequelize";

export class Image extends Model {}

Image.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    filename: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "No description provided",
    },
    is_main: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "image",
    underscored: true,
    freezeTableName: true,
  }
);
