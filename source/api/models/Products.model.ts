import mongoose from "mongoose";

export interface ProductData {
    productName: string;
    unit: string;
    category: string;
    image: string;
    slug: string;
}

export interface ProductDocument extends ProductData, mongoose.Document {
    createdAt: Date;
    updatedAt: Date;
    isArchived: boolean;
}

export const productSchema = new mongoose.Schema(
    {
        productName: {
            type: String,
            required: true,
            unique: true,
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "category",
        },
        unit: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "unit",
        },
        slug: {
            type: String,
            required: false,
        },
        image: {
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

const Product = mongoose.model<ProductDocument>("product", productSchema);

export default Product;
