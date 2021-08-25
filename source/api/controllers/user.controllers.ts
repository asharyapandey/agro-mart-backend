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
import { trimObject } from "../utilities/helperFunctions";

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
                    image: "images/profile/user.png",
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
                        userID: userFound._id,
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

export const editProfilePicture = async (req: Request, res: Response) => {
    const userID = req.currentUser._id;

    try {
        const userData = trimObject(req.body);
        const user = await User.findOne({
            _id: userID,
            isArchived: false,
        });
        let image = "";
        if (req.file) {
            image = req.file.path;
        } else {
            return res.status(BAD_REQUEST).json({
                success: false,
                message: label.auth.invalidFile,
                developerMessage: "",
                result: {},
            });
        }

        if (user) {
            user.image = image;
            const updatedUser = await user.save();
            const returnData = {
                _id: updatedUser?._id,
                fullName: updatedUser?.fullName,
                image: updatedUser?.image,
                phoneNumber: updatedUser?.phoneNumber,
            };
            return res.status(SUCCESS).json({
                success: true,
                message: label.auth.profileUpdated,
                developerMessage: "",
                result: returnData,
            });
        } else {
            return res.status(BAD_REQUEST).json({
                success: false,
                message: label.auth.noUserFound,
                developerMessage: "",
                result: {},
            });
        }
    } catch (error) {
        console.error(error);
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: label.auth.profileNotUpdated,
            developerMessage: error.message,
            result: {},
        });
    }
};

// ------------ Edit user profile ----------------------
export const editProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const userID = req.currentUser._id;

    try {
        const userData = trimObject(req.body);
        const user = await User.findOne({
            _id: userID,
            isArchived: false,
        });

        if (user) {
            const updatedUser = await User.findOneAndUpdate(
                { _id: userID },
                {
                    $set: userData,
                },
                { new: true }
            );
            const returnData = {
                _id: updatedUser?._id,
                fullName: updatedUser?.fullName,
                image: updatedUser?.image,
                phoneNumber: updatedUser?.phoneNumber,
            };
            return res.status(SUCCESS).json({
                success: true,
                message: label.auth.profileUpdated,
                developerMessage: "",
                result: returnData,
            });
        } else {
            return res.status(BAD_REQUEST).json({
                success: false,
                message: label.auth.noUserFound,
                developerMessage: "",
                result: {},
            });
        }
    } catch (error) {
        console.error(error);
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: label.auth.profileNotUpdated,
            developerMessage: error.message,
            result: {},
        });
    }
};

// ------------ change password----------------------
export const changePassword = async (req: Request, res: Response) => {
    const userID = req.currentUser._id;
    const { newPassword, oldPassword } = req.body;

    try {
        const user = await User.findOne({
            _id: userID,
            isArchived: false,
        });

        if (user) {
            const currentPassword = user.password;
            const isMatching = await decryptPassword(
                oldPassword,
                currentPassword
            );
            if (isMatching) {
                // checking if old and new password is the same

                if (oldPassword === newPassword) {
                    return res.status(BAD_REQUEST).json({
                        success: false,
                        message: label.auth.oldAndNewAreSame,
                        developerMessage: "",
                        result: {},
                    });
                }
                const hashedPassword = await encryptPassword(newPassword);
                if (hashedPassword.hash) {
                    user.password = hashedPassword.hash;
                    const updatedUser = await user.save();

                    return res.status(SUCCESS).json({
                        success: true,
                        message: label.auth.passwordChanged,
                        developerMessage: "",
                        result: updatedUser,
                    });
                } else {
                    throw new Error(label.auth.hashPasswordError);
                }
            } else {
                return res.status(BAD_REQUEST).json({
                    success: false,
                    message: label.auth.passwordDontMatch,
                    developerMessage: "",
                    result: {},
                });
            }
        } else {
            return res.status(BAD_REQUEST).json({
                success: false,
                message: label.auth.maybeSuspended,
                developerMessage: "",
                result: {},
            });
        }
    } catch (error) {
        console.error(error);
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: label.auth.passwordChangeError,
            developerMessage: error.message,
            result: {},
        });
    }
};

export const userProfile = async (req: Request, res: Response) => {
    const userID = req.currentUser._id;
    try {
        const userProfile = await User.findOne(
            {
                _id: userID,
            },
            { password: 0, permissionLevel: 0, isArchived: 0 }
        );
        return res.status(SUCCESS).json({
            success: true,
            message: label.auth.viewProfileSuccess,
            developerMessage: "",
            result: userProfile,
        });
    } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: label.auth.viewProfileError,
            developerMessage: error.message,
            result: {},
        });
    }
};
