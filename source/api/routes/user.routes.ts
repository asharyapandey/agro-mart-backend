import express, { NextFunction } from "express";
import passport from "passport";
import { Request, Response } from "express";
import {
    REGISTER_USER_ROUTE,
    GOOGLE_LOGIN_ROUTE,
    GOOGLE_AUTH_CALLBACK_ROUTE,
    LOCAL_LOGIN_ROUTE,
    ADMIN_LOGIN_ROUTE,
    PROFILE_PICTURE_ROUTE,
    PROFILE_ROUTE,
    PASSWORD_ROUTE,
} from "../constants/user.constants";
import {
    changePassword,
    editProfile,
    editProfilePicture,
    loginAdmin,
    loginUser,
    registerUser,
    userProfile,
} from "../controllers/user.controllers";
import { SUCCESS } from "../constants/status-codes.constants";
import {
    createSuperUser,
    validateRegisterBody,
} from "../middleware/user.middlewares";
import { authenticateToken } from "../middleware/authentication.middleware";
import { profileUpload } from "../middleware/multer.middlewares";

const userRoutes = express.Router();

userRoutes.post(REGISTER_USER_ROUTE, validateRegisterBody, registerUser);

userRoutes.post(LOCAL_LOGIN_ROUTE, loginUser);

userRoutes.post(ADMIN_LOGIN_ROUTE, createSuperUser, loginAdmin);

userRoutes.post(
    PROFILE_PICTURE_ROUTE,
    authenticateToken,
    profileUpload.single("image"),
    editProfilePicture
);

userRoutes.post(PROFILE_ROUTE, authenticateToken, editProfile);

userRoutes.get(PROFILE_ROUTE, authenticateToken, userProfile);

userRoutes.post(PASSWORD_ROUTE, authenticateToken, changePassword);

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
