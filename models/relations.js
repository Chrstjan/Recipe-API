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
    onDelete: "CASCADE",
  });

  Category.hasMany(Recipe, {
    foreignKey: "category_id",
    as: "recipes",
    onDelete: "CASCADE",
  });

  // Recipe / Cuisine relation
  Recipe.belongsTo(Cuisine, {
    foreignKey: "cuisine_id",
    as: "cuisine",
    onDelete: "CASCADE",
  });

  Cuisine.hasMany(Recipe, {
    foreignKey: "cuisine_id",
    as: "recipes",
    onDelete: "CASCADE",
  });

  // Recipe / Difficulty relation
  Recipe.belongsTo(Difficulty, {
    foreignKey: "difficulty_id",
    as: "difficulty",
    onDelete: "CASCADE",
  });

  Difficulty.hasMany(Recipe, {
    foreignKey: "difficulty_id",
    as: "recipes",
    onDelete: "CASCADE",
  });

  // Comment / Recipe relation
  Comment.belongsTo(Recipe, {
    foreignKey: "recipe_id",
    as: "recipe",
    onDelete: "CASCADE",
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
    onDelete: "CASCADE",
  });

  //#endregion recipe relations

  //#region ingredients / instructions / tags

  // Recipe Ingredients / Recipe relation
  RecipeIngredient.belongsTo(Recipe, {
    foreignKey: "recipe_id",
    as: "recipe",
    onDelete: "CASCADE",
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
    onDelete: "CASCADE",
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

  Tag.hasMany(RecipeTag, {
    foreignKey: "tag_id",
    as: "recipe_tag",
    onDelete: "CASCADE",
  });

  // Recipe Tag / Recipe relation
  RecipeTag.belongsTo(Recipe, {
    foreignKey: "recipe_id",
    as: "tag_recipe",
    onDelete: "CASCADE",
  });

  Recipe.hasMany(RecipeTag, {
    foreignKey: "recipe_id",
    as: "tags",
    onDelete: "CASCADE",
  });

  RecipeTag.hasMany(Recipe, {
    foreignKey: "id",
    as: "recipes",
    onDelete: "CASCADE",
  });

  //#endregion ingredients / instructions / tags

  //#region user relations

  // Favorite / User relation
  Favorite.belongsTo(User, {
    foreignKey: "user_id",
    as: "user",
    onDelete: "CASCADE",
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
    onDelete: "CASCADE",
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
    onDelete: "CASCADE",
  });

  //#endregion user relations

  // Recipe / Image relation
  ImageRel.belongsTo(Recipe, {
    foreignKey: "recipe_id",
    as: "recipe",
    onDelete: "CASCADE",
  });

  Recipe.hasMany(ImageRel, {
    foreignKey: "recipe_id",
    as: "images",
    onDelete: "CASCADE",
  });

  ImageRel.belongsTo(Image, {
    foreignKey: "image_id",
    as: "image_rel",
    onDelete: "CASCADE",
  });

  ImageRel.hasOne(Image, {
    foreignKey: "id",
    as: "image",
    onDelete: "CASCADE",
  });
};
