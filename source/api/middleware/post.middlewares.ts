import { Request, Response, NextFunction } from "express";
import { BAD_REQUEST } from "../constants/status-codes.constants";
import { ErrorType } from "../types/interfaces";
import { postValidation } from "../validations/post.validations";

export const validatePostBody = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { status, message }: ErrorType = postValidation(req.body);

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
