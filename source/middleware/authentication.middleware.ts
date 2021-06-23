import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import label from "../api/label/label";

export const authenticateToken = (
    req: any,
    res: Response,
    next: NextFunction
) => {
    try {
        const authorization = req?.headers?.["authorization"]?.split(" ")[1];
        if (!authorization) {
            throw new Error(label.auth.noTokenFound);
        } else {
            const decodedJwt = jwt.verify(
                authorization,
                process?.env?.ACCESS_TOKEN_SECRET as string
            );
            if (decodedJwt) {
                req["token"] = decodedJwt;
                next();
            } else {
                throw new Error(label.auth.tokenDidNotMatch);
            }
        }
    } catch (err) {
        res.status(500).json({
            status: "Failure",
            message: label.auth.authenticationFailed,
            systemMessage: err.message,
        });
    }
};
