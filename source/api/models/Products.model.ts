import mongoose from "mongoose";

export interface CategoryData {
    category: string;
    displayName: string;
    image: string;
    slug: string;
}

export interface CategoryDocument extends CategoryData, mongoose.Document {
    createdAt: Date;
    updatedAt: Date;
    isArchived: boolean;
}

export const categorySchema = new mongoose.Schema(
    {
        category: {
            type: String,
            required: true,
            unique: true,
        },
        slug: {
            type: String,
            required: false,
        },
        displayName: {
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

const Category = mongoose.model<CategoryDocument>("category", categorySchema);

export default Category;
