import { Request, Response, NextFunction } from "express";
import {
    INTERNAL_SERVER_ERROR,
    SUCCESS,
} from "../constants/status-codes.constants";
import label from "../label/label";
import Category from "../models/Category.model";

export const searchCategory = async (req: Request, res: Response) => {
    const page: number = parseInt(req?.query.page as string) || 1;
    const limit: number = parseInt(req?.query.limit as string) || 0;

    const searchTerm = req?.query?.searchTerm as string;

    const query = {
        displayName: new RegExp(searchTerm, "i"),
        isArchived: false,
    };

    try {
        const categoryFound = await Category.find(query)
            .skip(page * limit - limit)
            .limit(limit);
        const totalCategories = await Category.countDocuments(query);

        if (categoryFound && totalCategories > 0) {
            return res.status(SUCCESS).json({
                success: true,
                message: label.category.categoryFetched,
                developerMessage: "",
                result: categoryFound,
                page,
                totalCount: totalCategories,
            });
        } else {
            return res.status(SUCCESS).json({
                success: true,
                message: label.category.categoryFetched,
                developerMessage: "",
                result: [],
                page,
                totalCount: totalCategories,
            });
        }
    } catch (error) {
        console.error(error);
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: label.category.categoryFetchError,
            developerMessage: error.message,
            result: [],
        });
    }
};

export const addCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { category, displayName, slug } = req.body;

    try {
        const categoryObj = new Category({
            category,
            displayName,
            slug,
        });
        const categoryData = await categoryObj.save();

        if (categoryData) {
            return res.status(SUCCESS).json({
                success: true,
                message: label.category.categoryAdded,
                developerMessage: "",
                result: categoryData,
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: label.category.categoryAddError,
            developerMessage: error.message,
            result: {},
        });
    }
};

export const deleteCategory = async (req: Request, res: Response) => {
    const categoryID = req.params.categoryID;

    try {
        const category = await Category.findOne({
            _id: categoryID,
            isArchived: false,
        });

        if (category) {
            category.isArchived = true;
            const deletedUnit = await category.save();
            return res.status(SUCCESS).json({
                success: true,
                message: label.category.categoryDeleted,
                developerMessage: "",
                result: deletedUnit,
            });
        } else {
            throw new Error(label.category.categoryNotFound);
        }
    } catch (error) {
        console.error(error);
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: label.category.categoryDeleteError,
            developerMessage: error.message,
            result: {},
        });
    }
};

export const editCategory = async (req: Request, res: Response) => {
    const categoryID = req.params.categoryID;
    const { category, displayName, slug } = req.body;

    try {
        const currentCategory = await Category.findOne({
            _id: categoryID,
            isArchived: false,
        });

        if (currentCategory) {
            currentCategory.category = category;
            currentCategory.displayName = displayName;
            currentCategory.slug = slug;
            const updatedCategory = await currentCategory.save();
            res.status(SUCCESS).json({
                success: true,
                message: label.category.categoryUpdated,
                developerMessage: "",
                result: updatedCategory,
            });
        } else {
            throw new Error(label.category.categoryNotFound);
        }
    } catch (error) {
        console.error(error);
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: label.category.categoryUpdateError,
            developerMessage: error.message,
            result: {},
        });
    }
};
