import express, { NextFunction } from "express";
import passport from "passport";
import { Request, Response } from "express";
import {
    REGISTER_USER_ROUTE,
    GOOGLE_LOGIN_ROUTE,
    GOOGLE_AUTH_CALLBACK_ROUTE,
    LOCAL_LOGIN_ROUTE,
} from "../constants/user.constants";
import { registerUser } from "../controllers/user.controllers";
import { SUCCESS } from "../constants/status-codes.constants";

const userRoutes = express.Router();

userRoutes.post(REGISTER_USER_ROUTE, registerUser);

userRoutes.post(
    LOCAL_LOGIN_ROUTE,
    (req: Request, res: Response, next: NextFunction) => {
        passport.authenticate(
            "local",
            (err: Error, user: boolean, info: any) => {
                if (info?.success) {
                    res.status(SUCCESS).json(info);
                } else {
                    res.redirect("/login");
                }
            }
        )(req, res, next);
    }
);

userRoutes.get(
    GOOGLE_LOGIN_ROUTE,
    passport.authenticate(
        "google",
        { scope: ["profile", "email"] },
        (req: Request, res: any) => {
            res.end();
        }
    )
);

userRoutes.get(
    GOOGLE_AUTH_CALLBACK_ROUTE,
    (req: Request, res: Response, next: NextFunction) => {
        passport.authenticate(
            "google",
            (err: Error, user: boolean, info: any) => {
                if (info?.success) {
                    res.status(SUCCESS).json(info);
                } else {
                    res.redirect("/login");
                }
            }
        )(req, res, next);
    }
);
export = userRoutes;
