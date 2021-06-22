import { Request, Response, NextFunction } from "express";
import {
    INTERNAL_SERVER_ERROR,
    SUCCESS,
} from "../constants/status-codes.constants";
import User, { UserDocument } from "../models/User.model";

export const registerUser = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { email, fullName, password } = req.body;
        res.status(SUCCESS).json("server is working");
    } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json();
    }
};

type responseObject = {
    success: boolean;
    message: string;
    developerMessage: string;
    result: UserDocument | UserDocument[];
};
