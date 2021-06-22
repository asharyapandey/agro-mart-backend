import express, { Request, Response, NextFunction } from "express";
import morgan from "morgan";
import userRoutes from "../api/routes/user.routes";
import dotenv from "dotenv";
import path from "path";
import passport from "passport";
import loadPassport from "../api/auth/passport";

const VERSION = "/api/v1";

const app = express();

const env = process.env.NODE_ENV;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// requiring passport

if (env === "development") {
    app.use(morgan("dev"));
}

// setting up the environment variables according to the environment i.e production/ development
if (env === "development") {
    dotenv.config({
        path: path.join(__dirname, "../", "../", ".env.development"),
    });
} else {
    dotenv.config({ path: `${__dirname}/.env.development` });
}

loadPassport(app);

// adding routes
app.use(VERSION, userRoutes);

export default app;
