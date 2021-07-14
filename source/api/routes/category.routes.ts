import express from "express";
import {
    authenticateToken,
    isAdmin,
} from "../middleware/authentication.middleware";
import {
    EDIT_DELETE_CATEGORY,
    GET_ADD_CATEGORY,
} from "../constants/category.constants";
import {
    addCategory,
    deleteCategory,
    editCategory,
    searchCategory,
} from "../controllers/category.controllers";
import {
    checkCategoryUniqueness,
    validateCategoryBody,
} from "../middleware/category.middleware";

const categoryRoutes = express.Router();

categoryRoutes.get(
    GET_ADD_CATEGORY,
    authenticateToken,
    isAdmin,
    searchCategory
);

categoryRoutes.post(
    GET_ADD_CATEGORY,
    authenticateToken,
    isAdmin,
    validateCategoryBody,
    checkCategoryUniqueness,
    addCategory
);

categoryRoutes.put(
    EDIT_DELETE_CATEGORY,
    authenticateToken,
    isAdmin,
    checkCategoryUniqueness,
    editCategory
);

categoryRoutes.delete(
    EDIT_DELETE_CATEGORY,
    authenticateToken,
    isAdmin,
    deleteCategory
);

export default categoryRoutes;
