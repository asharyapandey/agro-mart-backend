import passport from "passport";
import User from "../models/User.model";
import { Strategy as LocalStrategy } from "passport-local";
import { OAuth2Strategy as GoogleStrategy } from "passport-google-oauth";
import { decryptPassword, generateToken } from "../utilities/auth.utilities";
import { Application } from "express";
import label from "../label/label";

const loadPassport = (app: Application) => {
    passport.serializeUser((user: any, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(function (userId, done) {
        User.findById(userId)
            .then(function (user) {
                done(null, user);
            })
            .catch(function (err) {
                done(err);
            });
    });

    passport.use(
        new LocalStrategy(
            {
                usernameField: "phoneNumber",
                passwordField: "password",
            },
            async (phoneNumber: string, password: string, done: any) => {
                try {
                    const newUser = await User.findOne({ phoneNumber });
                    if (newUser) {
                        const plainPassword = password;
                        const hashedPassword = newUser.password;
                        const passwordMatched = await decryptPassword(
                            plainPassword,
                            hashedPassword
                        );

                        if (passwordMatched) {
                            const token = generateToken(newUser._id as string);
                            if (token) {
                                done(null, false, {
                                    success: true,
                                    token: token,
                                    message: label.auth.loginSuccessful,
                                    developerMessage: "",
                                    successfulLogin: true,
                                });
                            }
                        } else {
                            done(null, false, {
                                success: false,
                                token: null,
                                message: label.auth.emailPasswordError,
                                developerMessage: "",
                            });
                        }
                    }
                } catch (error) {
                    done(null, false, {
                        success: false,
                        token: null,
                        message: label.auth.loginError,
                        developerMessage: error.message,
                    });
                }
            }
        )
    );

    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID as string,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
                callbackURL:
                    "http://localhost:7000/api/v1/auth/google/callback",
            },
            async (
                accessToken: string,
                refreshToken: string,
                profile: any,
                done: any
            ) => {
                try {
                    const email = profile?.emails?.[0]?.value;
                    if (!email) {
                        throw new Error(
                            "Email address is not received from google server, please try manual login."
                        );
                    }
                    let userFound = await User.findOne({
                        email: profile?.emails?.[0]?.value || "",
                        isArchived: false,
                    });

                    if (userFound) {
                        userFound.fullName = profile?.displayName;
                        userFound.image = profile?.photos?.[0]?.value || "";
                        await userFound.save();
                        const token = generateToken(userFound._id);
                        if (token) {
                            done(null, true, {
                                success: true,
                                token: token,
                                message: label.auth.loginSuccessful,
                                developerMessage: "",
                                userId: `${userFound?._id}`,
                            });
                        }
                    } else {
                        const user = await User.create({
                            fullName: profile?.displayName || "",
                            email: profile?.emails?.[0]?.value || "",
                            image: profile?.photos?.[0]?.value || "",
                        });
                        if (user) {
                            const token = generateToken(user._id);
                            if (token) {
                                done(null, false, {
                                    success: true,
                                    token: token,
                                    message: label.auth.loginSuccessful,
                                    developerMessage: "",
                                    userId: `${user?._id}`,
                                });
                            }
                        }
                    }
                } catch (error) {
                    done(null, false, {
                        success: false,
                        token: null,
                        message: label.auth.loginError,
                        developerMessage: error.message,
                    });
                }
            }
        )
    );

    app.use(passport.initialize());
};

export default loadPassport;
