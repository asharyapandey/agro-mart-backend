import express from "express";
import {
    authenticateToken,
    isAdmin,
} from "../middleware/authentication.middleware";
import { EDIT_DELETE_UNIT, GET_ADD_UNIT } from "../constants/unit.constants";
import {
    addUnit,
    deleteUnit,
    editUnit,
    searchUnit,
} from "../controllers/unit.controllers";
import { validateUnitBody } from "../middleware/unit.middlewares";

const unitRoutes = express.Router();

unitRoutes.get(GET_ADD_UNIT, authenticateToken, searchUnit);

unitRoutes.post(
    GET_ADD_UNIT,
    authenticateToken,
    isAdmin,
    validateUnitBody,
    addUnit
);

unitRoutes.put(EDIT_DELETE_UNIT, authenticateToken, isAdmin, editUnit);

unitRoutes.delete(EDIT_DELETE_UNIT, authenticateToken, isAdmin, deleteUnit);

export default unitRoutes;
