import { Request, Response, NextFunction } from "express";
import label from "../label/label";
import {
    BAD_REQUEST,
    CREATED,
    INTERNAL_SERVER_ERROR,
    SUCCESS,
} from "../constants/status-codes.constants";
import User, { UserDocument } from "../models/User.model";
import {
    decryptPassword,
    encryptPassword,
    generateToken,
} from "../utilities/auth.utilities";
import { ADMIN_PERMISSION_LEVEL } from "../constants/global.constant";

export const registerUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { phoneNumber, fullName, permissionLevel, password } = req.body;
        const isUser = await User.findOne({ phoneNumber, isArchived: false });
        // user exists
        if (isUser) {
            return res.status(BAD_REQUEST).json({
                success: false,
                message: label.auth.userAlreadyExists,
                developerMessage: "",
                result: [],
            });
        } else {
            const { error, hash } = await encryptPassword(password);
            if (error) {
                return res.status(INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: label.auth.couldNotRegisterUser,
                    developerMessage: "",
                    result: [],
                });
            } else {
                const userObj = new User({
                    phoneNumber,
                    fullName,
                    permissionLevel,
                    password: hash,
                    image: "dummy.png",
                });
                const user = await userObj.save();
                return res.status(CREATED).json({
                    success: true,
                    message: label.auth.userRegistered,
                    developerMessage: "",
                    result: [],
                });
            }
        }
    } catch (error) {
        console.error(error);
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: label.auth.couldNotRegisterUser,
            developerMessage: error.message,
            result: [],
        });
    }
};
export const loginUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { phoneNumber, password } = req.body;

    try {
        const userFound = await User.findOne({
            phoneNumber,
            isArchived: false,
        });
        if (userFound) {
            const plainPassword = password;
            const hashedPassword = userFound.password;
            const passwordMatched = await decryptPassword(
                plainPassword,
                hashedPassword
            );

            if (passwordMatched) {
                const token = generateToken(userFound._id);
                if (token) {
                    return res.status(SUCCESS).json({
                        success: true,
                        message: label.auth.loginSuccessful,
                        developerMessage: "",
                        result: [],
                        token: token,
                        permissionLevel: userFound.permissionLevel,
                    });
                } else {
                    res.status(INTERNAL_SERVER_ERROR).json({
                        success: false,
                        message: label.auth.noTokenFound,
                        developerMessage: "",
                        result: [],
                    });
                }
            } else {
                res.status(BAD_REQUEST).json({
                    success: false,
                    message: label.auth.emailPasswordError,
                    developerMessage: "",
                    result: [],
                });
            }
        } else {
            // user not found
            res.status(INTERNAL_SERVER_ERROR).json({
                success: false,
                message: label.auth.noUserFound,
                developerMessage: "",
                result: [],
            });
        }
    } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: label.auth.loginError,
            developerMessage: error.message,
            result: [],
        });
    }
};

export const loginAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { phoneNumber, password } = req.body;

    try {
        console.log(phoneNumber, password);
        const userFound = await User.findOne({
            phoneNumber,
            permissionLevel: ADMIN_PERMISSION_LEVEL,
            isArchived: false,
        });
        if (userFound) {
            const plainPassword = password;
            const hashedPassword = userFound.password;
            const passwordMatched = await decryptPassword(
                plainPassword,
                hashedPassword
            );

            if (passwordMatched) {
                const token = generateToken(userFound._id);
                if (token) {
                    return res.status(SUCCESS).json({
                        success: true,
                        message: label.auth.loginSuccessful,
                        developerMessage: "",
                        result: {},
                        token: token,
                        permissionLevel: userFound.permissionLevel,
                    });
                } else {
                    res.status(INTERNAL_SERVER_ERROR).json({
                        success: false,
                        message: label.auth.noTokenFound,
                        developerMessage: "",
                        result: {},
                    });
                }
            } else {
                res.status(BAD_REQUEST).json({
                    success: false,
                    message: label.auth.emailPasswordError,
                    developerMessage: "",
                    result: {},
                });
            }
        } else {
            // user not found
            res.status(INTERNAL_SERVER_ERROR).json({
                success: false,
                message: label.auth.notAdmin,
                developerMessage: "",
                result: {},
            });
        }
    } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: label.auth.loginError,
            developerMessage: error.message,
            result: {},
        });
    }
};
