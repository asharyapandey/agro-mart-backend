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
    const { status, message }: ErrorType = userValidation(
        JSON.parse(JSON.stringify(req.body))
    );

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
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const phoneNumber = "9841000000";
        const password = "superuser123";

        const userFound = await User.find({ isArchived: false });

        if (userFound.length > 0) {
            // check if superuser exists
            const user = await User.findOne({
                phoneNumber,
                isArchived: false,
            });
            if (user) {
                next();
            } else {
                const { error: hashedFailed, hash: hashedPassword } =
                    await encryptPassword(password);
                if (!hashedFailed) {
                    if (hashedPassword) {
                        const newUserObj = new User({
                            phoneNumber,
                            password: hashedPassword,
                            image: "images/profile/user.png",
                            fullName: "superuser",
                            permissionLevel: ADMIN_PERMISSION_LEVEL,
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
                        phoneNumber,
                        password: hashedPassword,
                        image: "images/profile/user.png",
                        fullName: "superuser",
                        permissionLevel: ADMIN_PERMISSION_LEVEL,
                    });
                    const newUser = await newUserObj.save();
                    if (newUser) {
                        next();
                    }
                }
            }
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            status: "Failure",
            message: label.auth.error,
            developerMessage: err.message,
        });
    }
};
