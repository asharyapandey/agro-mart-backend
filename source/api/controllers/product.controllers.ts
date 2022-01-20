import { Request, Response, NextFunction } from "express";
import {
    INTERNAL_SERVER_ERROR,
    SUCCESS,
} from "../constants/status-codes.constants";
import label from "../label/label";
import Product from "../models/Product.model";

export const searchProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const page: number = parseInt(req?.query.page as string) || 1;
    const limit: number = parseInt(req?.query.limit as string) || 0;

    const searchTerm = req?.query?.searchTerm as string;

    const query = {
        productName: new RegExp(searchTerm, "i"),
        isArchived: false,
    };

    try {
        const productFound = await Product.find(query)
            .skip(page * limit - limit)
            .limit(limit)
            .populate("category", "displayName")
            .populate("unit", "displayName");
        const totalProducts = await Product.countDocuments(query);

        if (productFound && totalProducts > 0) {
            return res.status(SUCCESS).json({
                success: true,
                message: label.product.productFetched,
                developerMessage: "",
                result: productFound,
                page,
                totalCount: totalProducts,
            });
        } else {
            return res.status(SUCCESS).json({
                success: true,
                message: label.product.productFetched,
                developerMessage: "",
                result: [],
                page,
                totalCount: totalProducts,
            });
        }
    } catch (error: any) {
        console.error(error);
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: label.product.productFetchError,
            developerMessage: error.message,
            result: [],
        });
    }
};

export const addProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { productName, unit, category, kalimatiPrice, slug } = req.body;

    try {
        const productObj = new Product({
            productName,
            unit,
            category,
            kalimatiPrice,
            slug,
        });
        const productData = await productObj.save();
        const newProductData = await Product.findOne({ _id: productData._id })
            .populate("category", "displayName")
            .populate("unit", "displayName");

        if (productData) {
            res.status(SUCCESS).json({
                success: true,
                message: label.product.productAdded,
                developerMessage: "",
                result: newProductData,
            });
        }
    } catch (error: any) {
        console.error(error);
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: label.product.productAdded,
            developerMessage: error.message,
            result: {},
        });
    }
};

export const deleteProduct = async (req: Request, res: Response) => {
    const productID = req.params.productID;

    try {
        const product = await Product.findOne({
            _id: productID,
            isArchived: false,
        });

        if (product) {
            product.isArchived = true;
            const deletedProduct = await product.save();
            return res.status(SUCCESS).json({
                success: true,
                message: label.product.productDeleted,
                developerMessage: "",
                result: deletedProduct,
            });
        } else {
            throw new Error(label.product.productNotFound);
        }
    } catch (error: any) {
        console.error(error);
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: label.product.productDeleteError,
            developerMessage: error.message,
            result: {},
        });
    }
};

export const editProduct = async (req: Request, res: Response) => {
    const productID = req.params.productID;
    const { productName, unit, category, kalimatiPrice, slug } = req.body;

    try {
        const currentProduct = await Product.findOne({
            _id: productID,
            isArchived: false,
        });

        if (currentProduct) {
            currentProduct.unit = unit;
            currentProduct.productName = productName;
            currentProduct.category = category;
            currentProduct.kalimatiPrice = kalimatiPrice;
            currentProduct.slug = slug;

            const updatedProduct = await currentProduct.save();
            const newProductData = await Product.findOne({
                _id: updatedProduct._id,
            })
                .populate("category", "displayName")
                .populate("unit", "displayName");

            res.status(SUCCESS).json({
                success: true,
                message: label.product.productUpdated,
                developerMessage: "",
                result: newProductData,
            });
        } else {
            throw new Error(label.product.productNotFound);
        }
    } catch (error: any) {
        console.error(error);
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: label.product.productUpdateError,
            developerMessage: error.message,
            result: {},
        });
    }
};
