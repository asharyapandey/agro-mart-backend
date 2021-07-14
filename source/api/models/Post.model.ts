import mongoose from "mongoose";
import { ProductDocument } from "./Product.model";
import { UserDocument } from "./User.model";

export interface PostData {
    product: string | ProductDocument;
    name: string;
    address: string;
    farmerPrice: string;
    image: string;
    userID: string | UserDocument;
}

export interface PostDocument extends PostData, mongoose.Document {
    createdAt: Date;
    updatedAt: Date;
    isArchived: boolean;
}

export const postSchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "product",
        },
        name: {
            type: String,
            required: false,
        },
        address: {
            type: String,
            required: true,
        },
        farmerPrice: {
            type: Number,
            required: true,
            default: 0,
        },
        image: {
            type: String,
            required: true,
        },
        isArchived: {
            type: Boolean,
            required: true,
            default: false,
        },
        userID: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "user",
        },
    },
    {
        timestamps: true,
    }
);

const Post = mongoose.model<PostDocument>("post", postSchema);

export default Post;
