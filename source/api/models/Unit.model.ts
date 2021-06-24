import mongoose from "mongoose";

export interface UnitData {
    unit: string;
    displayName: string;
}

export interface UnitDocument extends UnitData, mongoose.Document {
    createdAt: Date;
    updatedAt: Date;
    isArchived: boolean;
}

const unitSchema = new mongoose.Schema(
    {
        unit: {
            type: String,
            required: true,
            unique: true,
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

const Unit = mongoose.model<UnitDocument>("unit", unitSchema);

export default Unit;
