import mongoose from "mongoose";
import { CategoryDocument } from "./Category.model";
import { UnitDocument } from "./Unit.model";

export interface ProductData {
    productName: string;
    unit: string | UnitDocument;
    category: string | CategoryDocument;
    slug: string;
    kalimatiPrice: number;
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
        kalimatiPrice: {
            type: Number,
            required: true,
            default: 0,
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
