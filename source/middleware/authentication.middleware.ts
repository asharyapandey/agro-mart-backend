import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import {
    ADMIN_PERMISSION_LEVEL,
    FARMER_PERMISSION_LEVEL,
} from "../api/constants/global.constant";
import { INTERNAL_SERVER_ERROR } from "../api/constants/status-codes.constants";
import label from "../api/label/label";
import User from "../api/models/User.model";

export const authenticateToken = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const authorization = req?.headers?.["authorization"]?.split(" ")[1];
        if (!authorization) {
            throw new Error(label.auth.noTokenFound);
        } else {
            console.log(authorization);
            console.log(process?.env?.ACCESS_TOKEN_SECRET);
            const decodedJwt: any = jwt.verify(
                authorization,
                process?.env?.ACCESS_TOKEN_SECRET as string
            );
            if (decodedJwt) {
                const user = await User.findOne({
                    _id: decodedJwt.id,
                    isArchived: false,
                });
                if (user) {
                    req.currentUser = user;
                } else {
                    throw new Error(label.auth.invalidToken);
                }
                next();
            } else {
                throw new Error(label.auth.tokenDidNotMatch);
            }
        }
    } catch (err) {
        console.log(err);
        res.status(INTERNAL_SERVER_ERROR).json({
            status: "Failure",
            message: label.auth.authenticationFailed,
            systemMessage: err.message,
        });
    }
};

export const isAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = req.currentUser;

        if (user.permissionLevel === ADMIN_PERMISSION_LEVEL) {
            next();
        } else {
            throw new Error(label.auth.accessNotGranted);
        }
    } catch (err) {
        res.status(INTERNAL_SERVER_ERROR).json({
            status: "Failure",
            message: label.auth.accessNotGranted,
            systemMessage: err.message,
        });
    }
};

export const isFarmer = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = req.currentUser;

        if (user.permissionLevel === FARMER_PERMISSION_LEVEL) {
            next();
        } else {
            throw new Error(label.auth.accessNotGranted);
        }
    } catch (err) {
        res.status(INTERNAL_SERVER_ERROR).json({
            status: "Failure",
            message: label.auth.accessNotGranted,
            systemMessage: err.message,
        });
    }
};
