import express, { Request, Response, NextFunction } from "express";
import {
    INTERNAL_SERVER_ERROR,
    SUCCESS,
} from "../constants/status-codes.constants";
import { authenticateToken } from "../middleware/authentication.middleware";
import getCloudinary from "../utilities/cloudinary";

const uploadRoutes = express.Router();

uploadRoutes.post(
    "/upload",
    authenticateToken,
    async (req: Request, res: Response) => {
        try {
            const data = req.body.data;
            const cloudinary = getCloudinary();
            const uploadResponse = await cloudinary.uploader.upload(data, {
                upload_preset: "ml_default",
            });
            res.status(SUCCESS).json({ url: uploadResponse.secure_url });
        } catch (error) {
            console.log(error);
            res.status(INTERNAL_SERVER_ERROR).json({ url: "" });
        }
    }
);

export = uploadRoutes;
