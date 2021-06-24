import { Request, Response, NextFunction } from "express";
import { INTERNAL_SERVER_ERROR } from "../constants/status-codes.constants";
import label from "../label/label";
import Unit from "../models/Unit.model";

export const searchUnit = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const page: number = parseInt(req?.query.page as string) || 1;
    const limit: number = parseInt(req?.query.limit as string) || 0;

    const searchTerm = req?.query?.searchTerm as string;

    const query = {
        displayName: new RegExp(searchTerm, "i"),
    };

    try {
    } catch (error) {
        console.error(error);
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: label.auth.couldNotRegisterUser,
            developerMessage: error.message,
            result: [],
        });
    }
};
