import express from "express";
import passport from "passport";
import {
    REGISTER_USER_ROUTE,
    GOOGLE_LOGIN_ROUTE,
    GOOGLE_AUTH_CALLBACK_ROUTE,
} from "../constants/user.constants";
import { registerUser } from "../controllers/user.controllers";

const userRoutes = express.Router();

userRoutes.post(REGISTER_USER_ROUTE, registerUser);

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
    passport.authenticate("google", { failureRedirect: "/login" })
);
export = userRoutes;
