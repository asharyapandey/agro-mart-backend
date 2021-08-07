import mongoose from "mongoose";
import { PostDocument } from "./Post.model";
import { UserDocument } from "./User.model";

export interface BidData {
    post: string | PostDocument;
    amountOffered: number;
    address: string;
    remarks: string;
    status: string;
    userID: string | UserDocument;
    belongsTo: string | UserDocument;
}

export interface BidDocument extends BidData, mongoose.Document {
    createdAt: Date;
    updatedAt: Date;
    isArchived: boolean;
    _doc: any;
}

export const bidSchema = new mongoose.Schema(
    {
        post: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "post",
        },
        amountOffered: {
            type: Number,
            required: false,
        },
        address: {
            type: String,
            required: true,
        },
        remarks: {
            type: String,
            required: false,
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
        belongsTo: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "user",
        },
        status: {
            type: String,
            required: true,
            enum: ["PENDING", "ACCEPTED", "REJECTED"],
            default: "PENDING",
        },
    },
    {
        timestamps: true,
    }
);

const Bid = mongoose.model<BidDocument>("bid", bidSchema);

export default Bid;
