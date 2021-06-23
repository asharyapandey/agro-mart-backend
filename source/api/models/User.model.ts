import mongoose from "mongoose";

export interface UserData {
    email: string;
    password: string;
    fullName: string;
    image: string;
    permissionLevel: number;
}

export interface UserDocument extends UserData, mongoose.Document {
    createdAt: Date;
    updatedAt: Date;
    isArchived: boolean;
}

export const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        fullName: {
            type: String,
            required: false,
        },
        image: {
            type: String,
            required: false,
        },
        permissionLevel: {
            type: Number,
            required: true,
        },
        password: {
            type: String,
            required: false,
        },
        isArchived: {
            type: Boolean,
            required: true,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model<UserDocument>("user", userSchema);

export default User;
