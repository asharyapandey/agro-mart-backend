import passport from "passport";
import User from "../models/User.model";
import { Strategy as LocalStrategy } from "passport-local";
import { OAuth2Strategy as GoogleStrategy } from "passport-google-oauth";
import { decryptPassword, generateToken } from "../utilities/auth.utilities";
import label from "../label/label";

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
            usernameField: "email",
            passwordField: "password",
        },
        async (email: string, password: string, done: any) => {
            try {
                const newUser = await User.findOne({ email });
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
                                status: true,
                                token: token,
                                message: label.auth.loginSuccessful,
                                developerMessage: "",
                                successfulLogin: true,
                            });
                        }
                    } else {
                        done(null, false, {
                            status: false,
                            token: null,
                            message: label.auth.emailPasswordError,
                            developerMessage: "",
                        });
                    }
                }
            } catch (error) {
                done(null, false, {
                    status: false,
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
            // clientID: GoogleClientID as string,
            // clientSecret: GoogleClientSecret as string,
            // callbackURL: GoogleCallbackURL as string,
            clientID:
                "175902549511-083e5rrkkqqqi4l6inh4me4p0f8epdg1.apps.googleusercontent.com",
            clientSecret: "OmxepN93Ixjqpaa3AWgl5M8q",
            callbackURL: "http://localhost:7000/api/v1/auth/google/callback",
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
                let userFound: any = await User.findOneAndUpdate(
                    {
                        email: profile?.emails?.[0]?.value || "",
                    },
                    {
                        fullName: profile?.username,
                        image: profile?.photos?.[0]?.value || "",
                    }
                );
                if (userFound) {
                    const token = generateToken(userFound._id);
                    if (token) {
                        done(null, false, {
                            status: "Success",
                            token: token,
                            message: label.auth.loginSuccessful,
                            developerMessage: "",
                            userId: `${userFound?._id}`,
                        });
                    }
                } else {
                    const user = await User.create({
                        fullName: profile?.username || "",
                        email: profile?.emails?.[0]?.value || "",
                        image: profile?.photos?.[0]?.value || "",
                    });
                    if (user) {
                        const token = generateToken(user._id);
                        if (token) {
                            done(null, false, {
                                status: true,
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
                    status: false,
                    token: null,
                    message: label.auth.loginError,
                    developerMessage: error.message,
                });
            }
        }
    )
);
