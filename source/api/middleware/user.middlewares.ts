import { Request, Response, NextFunction } from "express";
import { BAD_REQUEST } from "../constants/status-codes.constants";
import label from "../label/label";

export const validateRegisterBody = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const data = req.body;
    let status = false;
    let error = "";

    if (data.hasOwnProperty("email")) {
        status = false;
    } else {
        status = true;
        error = label.auth.validation("Email");
    }

    if (data.hasOwnProperty("fullName")) {
        status = false;
    } else {
        status = true;
        error = label.auth.validation("Full Name");
    }

    if (data.hasOwnProperty("password")) {
        status = false;
    } else {
        status = true;
        error = label.auth.validation("Password");
    }

    if (data.hasOwnProperty("permissionLevel")) {
        status = false;
    } else {
        status = true;
        error = label.auth.validation("Permission Level");
    }

    if (status) {
        res.status(BAD_REQUEST).json({
            success: false,
            message: error,
            developerMessage: error,
            result: [],
        });
    } else {
        next();
    }
};
