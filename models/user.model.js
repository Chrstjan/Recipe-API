import { sequelize } from "../config/sequelize.config.js";
import { DataTypes, Model } from "sequelize";
import bcrypt from "bcrypt";

export class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "",
    },
    refresh_token: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "-",
    },
  },
  {
    sequelize,
    modelName: "user",
    underscored: true,
    freezeTableName: true,
    hooks: {
      beforeCreate: async (User, options) => {
        User.password = await createHash(User.password);
      },
      beforeUpdate: async (User, options) => {
        User.password = await createHash(User.password);
      },
    },
    indexes: [{ unique: true, fields: ["email", "username"] }],
  }
);

User.addHook("beforeBulkCreate", async (users) => {
  for (const user of users) {
    user.password = await bcrypt.hash(user.password, 10);
  }
});

const createHash = async (string) => {
  const salt = await bcrypt.genSalt(10);
  const hashed_string = await bcrypt.hash(string, salt);
  return hashed_string;
};
