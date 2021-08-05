import { Request, Response, NextFunction } from "express";
import { ADMIN_PERMISSION_LEVEL } from "../constants/global.constant";
import { BAD_REQUEST } from "../constants/status-codes.constants";
import label from "../label/label";
import User from "../models/User.model";
import { ErrorType } from "../types/interfaces";
import { encryptPassword } from "../utilities/auth.utilities";
import { userValidation } from "../validations/user.validations";

export const validateRegisterBody = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { status, message }: ErrorType = userValidation(req.body);

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

export const createSuperUser = async (
    req: any,
    res: Response,
    next: NextFunction
) => {
    try {
        const email = "9841000000";
        const password = "superuser123";

        const userFound: any = await User.find({ isArchived: false });

        if (userFound) {
            // check if superuser exists
            const user: any = await User.findOne({ email, isArchived: false });
            if (user) {
                next();
            } else {
                const { error: hashedFailed, hash: hashedPassword } =
                    await encryptPassword(password);
                if (!hashedFailed) {
                    if (hashedPassword) {
                        const newUserObj = new User({
                            email,
                            password: hashedPassword,
                            image: "images/profile/user.png",
                            fullName: "superuser",
                            permissionLevel: ADMIN_PERMISSION_LEVEL,
                            phoneNumber: "9860180332",
                        });
                        const newUser = await newUserObj.save();
                        if (newUser) {
                            next();
                        }
                    }
                }
            }
        } else {
            // create a super user
            const { error: hashedFailed, hash: hashedPassword } =
                await encryptPassword(password);
            if (!hashedFailed) {
                if (hashedPassword) {
                    const newUserObj = new User({
                        email,
                        password: hashedPassword,
                        image: "images/profile/user.png",
                        fullName: "superuser",
                        permissionLevel: ADMIN_PERMISSION_LEVEL,
                        phoneNumber: "9860180332",
                    });
                    const newUser = await newUserObj.save();
                    if (newUser) {
                        next();
                    }
                }
            }
        }
    } catch (err) {
        res.status(500).json({
            status: "Failure",
            message: label.auth.error,
            developerMessage: err.message,
        });
    }
};
