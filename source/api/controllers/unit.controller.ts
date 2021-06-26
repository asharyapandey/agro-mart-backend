import { Request, Response, NextFunction } from "express";
import {
    INTERNAL_SERVER_ERROR,
    SUCCESS,
} from "../constants/status-codes.constants";
import label from "../label/label";
import Unit from "../models/Unit.model";

export const searchUnit = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const page: number = parseInt(req?.query.page as string) || 1;
    const limit: number = parseInt(req?.query.limit as string) || 0;

    const searchTerm = req?.query?.searchTerm as string;

    const query = {
        displayName: new RegExp(searchTerm, "i"),
        isArchived: false,
    };

    try {
        const unitFound = await Unit.find(query)
            .skip(page * limit - limit)
            .limit(limit);
        const totalUnits = await Unit.countDocuments(query);

        if (unitFound && totalUnits > 0) {
            return res.status(SUCCESS).json({
                success: true,
                message: label.unit.unitsFetched,
                developerMessage: "",
                result: unitFound,
                page,
                totalCount: totalUnits,
            });
        } else {
            return res.status(SUCCESS).json({
                success: true,
                message: label.unit.unitsFetched,
                developerMessage: "",
                result: [],
                page,
                totalCount: totalUnits,
            });
        }
    } catch (error) {
        console.error(error);
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: label.unit.unitsFetchError,
            developerMessage: error.message,
            result: [],
        });
    }
};

export const addUnit = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { unit, displayName } = req.body;

    try {
        const unitObj = new Unit({ unit, displayName });
        const unitData = await unitObj.save();

        if (unitData) {
            res.status(SUCCESS).json({
                success: true,
                message: label.unit.unitsAdded,
                developerMessage: "",
                result: unitData,
            });
        }
    } catch (error) {
        console.error(error);
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: label.unit.unitsAddError,
            developerMessage: error.message,
            result: {},
        });
    }
};

export const deleteUnit = async (req: Request, res: Response) => {
    const unitID = req.params.unitID;

    try {
        const unit = await Unit.findOne({ _id: unitID, isArchived: false });

        if (unit) {
            unit.isArchived = true;
            const deletedUnit = await unit.save();
            return res.status(SUCCESS).json({
                success: true,
                message: label.unit.unitsDeleted,
                developerMessage: "",
                result: deletedUnit,
            });
        } else {
            throw new Error(label.unit.unitNotFound);
        }
    } catch (error) {
        console.error(error);
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: label.unit.unitsDeleteError,
            developerMessage: error.message,
            result: {},
        });
    }
};

export const editUnit = async (req: Request, res: Response) => {
    const unitID = req.params.unitID;
    const { unit, displayName } = req.body;

    try {
        const currentUnit = await Unit.findOne({
            _id: unitID,
            isArchived: false,
        });

        if (currentUnit) {
            currentUnit.unit = unit;
            currentUnit.displayName = displayName;
            const updatedUnit = await currentUnit.save();
            res.status(SUCCESS).json({
                success: true,
                message: label.unit.unitsAdded,
                developerMessage: "",
                result: updatedUnit,
            });
        } else {
            throw new Error(label.unit.unitNotFound);
        }
    } catch (error) {
        console.error(error);
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: label.unit.unitsAddError,
            developerMessage: error.message,
            result: {},
        });
    }
};
