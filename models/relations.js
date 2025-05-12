import { User } from "./user.model.js";
import { Category } from "./category.model.js";
import { Cuisine } from "./cuisine.model.js";
import { Difficulty } from "./difficulty.model.js";
import { Recipe } from "./recipe.model.js";
import { RecipeIngredient } from "./recipe_ingredient.model.js";
import { RecipeInstruction } from "./recipe_instruction.model.js";
import { Tag } from "./tag.model.js";
import { RecipeTag } from "./recipe_tag.model.js";
import { Favorite } from "./favorite.model.js";
import { Comment } from "./comment.model.js";
import { Image } from "./image.model.js";
import { ImageRel } from "./image_rel.model.js";

export const setRelations = () => {
  //#region recipe relations

  // Recipe / User relation
  Recipe.belongsTo(User, {
    foreignKey: "user_id",
    as: "creator",
    onDelete: "CASCADE",
  });

  User.hasMany(Recipe, {
    foreignKey: "user_id",
    as: "recipes",
    onDelete: "CASCADE",
  });

  // Recipe / Category relation
  Recipe.belongsTo(Category, {
    foreignKey: "category_id",
    as: "category",
  });

  Category.hasMany(Recipe, {
    foreignKey: "category_id",
    as: "recipes",
  });

  // Recipe / Cuisine relation
  Recipe.belongsTo(Cuisine, {
    foreignKey: "cuisine_id",
    as: "cuisine",
  });

  Cuisine.hasMany(Recipe, {
    foreignKey: "cuisine_id",
    as: "recipes",
  });

  // Recipe / Difficulty relation
  Recipe.belongsTo(Difficulty, {
    foreignKey: "difficulty_id",
    as: "difficulty",
  });

  Difficulty.hasMany(Recipe, {
    foreignKey: "difficulty_id",
    as: "recipes",
  });

  // Comment / Recipe relation
  Comment.belongsTo(Recipe, {
    foreignKey: "recipe_id",
    as: "recipe",
  });

  Recipe.hasMany(Comment, {
    foreignKey: "recipe_id",
    as: "comments",
    onDelete: "CASCADE",
  });

  // Favorite / Recipe relation
  Favorite.belongsTo(Recipe, {
    foreignKey: "recipe_id",
    as: "recipe",
  });

  //#endregion recipe relations

  //#region ingredients / instructions / tags

  // Recipe Ingredients / Recipe relation
  RecipeIngredient.belongsTo(Recipe, {
    foreignKey: "recipe_id",
    as: "recipe",
  });

  Recipe.hasMany(RecipeIngredient, {
    foreignKey: "recipe_id",
    as: "ingredients",
    onDelete: "CASCADE",
  });

  // Recipe Instructions / Recipe relation
  RecipeInstruction.belongsTo(Recipe, {
    foreignKey: "recipe_id",
    as: "recipe",
  });

  Recipe.hasMany(RecipeInstruction, {
    foreignKey: "recipe_id",
    as: "instructions",
    onDelete: "CASCADE",
  });

  // Recipe Tag / Tag relation
  RecipeTag.belongsTo(Tag, {
    foreignKey: "tag_id",
    as: "tag",
    onDelete: "CASCADE",
  });

  Tag.hasOne(RecipeTag, {
    foreignKey: "tag_id",
    as: "tags",
  });

  // Recipe Tag / Recipe relation
  RecipeTag.belongsTo(Recipe, {
    foreignKey: "recipe_id",
    as: "recipe",
  });

  Recipe.hasMany(RecipeTag, {
    foreignKey: "recipe_id",
    as: "tags",
  });

  //#endregion ingredients / instructions / tags

  //#region user relations

  // Favorite / User relation
  Favorite.belongsTo(User, {
    foreignKey: "user_id",
    as: "user",
  });

  User.hasMany(Favorite, {
    foreignKey: "user_id",
    as: "favorites",
    onDelete: "CASCADE",
  });

  // Comments / User relation
  Comment.belongsTo(User, {
    foreignKey: "user_id",
    as: "user",
  });

  User.hasMany(Comment, {
    foreignKey: "user_id",
    as: "comments",
    onDelete: "CASCADE",
  });

  // Image / User relation
  Image.belongsTo(User, {
    foreignKey: "user_id",
    as: "user",
    onDelete: "CASCADE",
  });

  User.hasMany(Image, {
    foreignKey: "user_id",
    as: "images",
  });

  //#endregion user relations

  // Recipe / Image relation
  ImageRel.belongsTo(Recipe, {
    as: "recipe",
  });

  Recipe.hasMany(ImageRel, {
    as: "images",
  });

  ImageRel.belongsTo(Image, {
    foreignKey: "image_id",
    as: "image",
  });
};
