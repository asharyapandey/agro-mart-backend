import express, { Request, Response, NextFunction } from "express";
import morgan from "morgan";
import userRoutes from "../api/routes/user.routes";
import dotenv from "dotenv";
import path from "path";
import passport from "passport";
import loadPassport from "../api/auth/passport";
import unitRoutes from "../api/routes/unit.routes";
import categoryRoutes from "../api/routes/category.routes";
import productRoutes from "../api/routes/product.routes";
import postRoutes from "../api/routes/post.routes";
import uploadRoutes from "../api/routes/upload.routes";
import cors from "cors";
import bidRoutes from "../api/routes/bid.routes";

const VERSION = "/api/v1";

const app = express();

const env = process.env.NODE_ENV;

// for cors
app.use(cors());

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: false }));
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
    dotenv.config({
        path: path.join(__dirname, "../", "../", ".env.production"),
    });
}

loadPassport(app);
app.use(
    "/images",
    express.static(path.join(__dirname, "../", "../", "images"))
);
// adding routes
app.use(VERSION, userRoutes);
app.use(VERSION, unitRoutes);
app.use(VERSION, categoryRoutes);
app.use(VERSION, productRoutes);
app.use(VERSION, postRoutes);
app.use(VERSION, bidRoutes);
app.use(VERSION, uploadRoutes);

app.use((req: Request, res: Response) => {
    return res.status(404).json({
        success: false,
        message: "404! Route Not Found.",
        developerMessage: "",
        result: [],
    });
});

export default app;
