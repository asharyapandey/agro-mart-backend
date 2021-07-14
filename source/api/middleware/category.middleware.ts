import { Request, Response, NextFunction } from "express";
import { BAD_REQUEST } from "../constants/status-codes.constants";
import label from "../label/label";
import Category from "../models/Category.model";
import { ErrorType } from "../types/interfaces";
import { categoryValidation } from "../validations/category.validations";

export const validateCategoryBody = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { status, message }: ErrorType = categoryValidation(req.body);

    if (status) {
        res.status(BAD_REQUEST).json({
            success: false,
            message: message,
            developerMessage: message,
            result: [],
        });
    } else {
        next();
    }
};

export const checkCategoryUniqueness = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const error: ErrorType = { status: false, message: "" };
    const { category, slug } = req.body;
    const isCategory = await Category.findOne({ category, slug });
    if (isCategory) {
        error.status = true;
        error.message = label.category.categoryExists;
    } else {
        next();
    }

    if (error.status) {
        res.status(BAD_REQUEST).json({
            success: false,
            message: error.message,
            developerMessage: error.message,
            result: {},
        });
    } else {
        next();
    }
};
