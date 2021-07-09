import express from "express";
import {
    authenticateToken,
    isAdmin,
} from "../middleware/authentication.middleware";
import {
    ADD_PRODUCTS_ROUTE,
    GET_PRODUCTS_ROUTE,
    EDIT_DELETE_PRODUCTS_ROUTE,
} from "../constants/product.constants";
import {
    addProduct,
    editProduct,
    searchProduct,
    deleteProduct,
} from "../controllers/product.controllers";
import { validateProductBody } from "../middleware/product.middlewares";

const productRoutes = express.Router();

productRoutes.get(GET_PRODUCTS_ROUTE, authenticateToken, searchProduct);

productRoutes.post(
    ADD_PRODUCTS_ROUTE,
    authenticateToken,
    isAdmin,
    validateProductBody,
    addProduct
);

productRoutes.put(
    EDIT_DELETE_PRODUCTS_ROUTE,
    authenticateToken,
    isAdmin,
    editProduct
);

productRoutes.delete(
    EDIT_DELETE_PRODUCTS_ROUTE,
    authenticateToken,
    isAdmin,
    deleteProduct
);

export default productRoutes;
