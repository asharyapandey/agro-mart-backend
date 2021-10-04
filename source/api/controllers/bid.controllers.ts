import { Request, Response, NextFunction } from "express";
import {
    BAD_REQUEST,
    CREATED,
    INTERNAL_SERVER_ERROR,
    SUCCESS,
    UNAUTHORIZED,
} from "../constants/status-codes.constants";
import label from "../label/label";
import Bid, { BidDocument } from "../models/Bid.model";
import Post from "../models/Post.model";
import { UserDocument } from "../models/User.model";
import { trimObject } from "../utilities/helperFunctions";

export const searchBid = async (req: Request, res: Response) => {
    const postID = req?.query?.postID as string;
    const belongsTo = req?.query?.belongsTo as string;
    const userID = req?.query?.userID as string;

    const query = trimObject({
        post: postID,
        belongsTo,
        userID,
        isArchived: false,
    });

    try {
        const bidFound = await Bid.find(query)
            .sort({ createdAt: -1 })
            .populate("userID", "fullName email image")
            .populate("belongsTo", "fullName email image");

        const totalBid = await Bid.countDocuments(query);

        if (bidFound && totalBid > 0) {
            // checking if the post has a accepted bid or not
            let isPostBidAccepted = false;
            let maxBid = 0;
            bidFound.forEach((bid) => {
                if (bid.status === "ACCEPTED") {
                    isPostBidAccepted = true;
                }
                if (bid.amountOffered > maxBid) {
                    maxBid = bid.amountOffered;
                }
            });
            // sending that value to show accept/reject button to the user
            const addedBids = bidFound.map((bid) => {
                return {
                    ...bid._doc,
                    isPostBidAccepted,
                };
            });
            return res.status(SUCCESS).json({
                success: true,
                message: label.bid.bidFetched,
                developerMessage: "",
                result: addedBids,
                totalCount: totalBid,
                maxBid,
                isPostBidAccepted,
            });
        } else {
            return res.status(SUCCESS).json({
                success: true,
                message: label.bid.bidFetched,
                developerMessage: "",
                result: [],
                totalCount: totalBid,
                maxBid: 0,
            });
        }
    } catch (error) {
        console.error(error);
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: label.bid.bidFetchError,
            developerMessage: error.message,
            result: [],
        });
    }
};

export const addBid = async (req: Request, res: Response) => {
    const { amountOffered, address, remarks } = req.body;
    const postID = req.params.postID;

    try {
        const post = await Post.findOne({ _id: postID, isArchived: false });
        if (post) {
            const bidObj = new Bid({
                amountOffered,
                address,
                remarks,
                userID: req?.currentUser._id,
                post: postID,
                belongsTo: post.userID,
            });
            const bid = await bidObj.save();
            const newBid = await Bid.findOne({ _id: bid._id })
                .populate("userID", "email fullName image")
                .populate("belongsTo", "fullName email image");
            return res.status(CREATED).json({
                success: true,
                message: label.bid.bidAdded,
                developerMessage: "",
                result: newBid,
            });
        } else {
            return res.status(BAD_REQUEST).json({
                success: true,
                message: label.post.postNotFound,
                developerMessage: "",
                result: {},
            });
        }
    } catch (error) {
        console.error(error);
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: label.bid.bidAddError,
            developerMessage: error.message,
            result: {},
        });
    }
};

export const deleteBid = async (req: Request, res: Response) => {
    const bidID = req.params.bidID;
    const user = req.currentUser;

    try {
        const bid = await Bid.findOne({ _id: bidID, isArchived: false })
            .populate("userID", "email fullName image")
            .populate("belongsTo", "fullName email image");

        if (bid) {
            const bidUser = bid.userID as UserDocument;
            if (bidUser._id.toString() === user._id.toString()) {
                bid.isArchived = true;
                const deletedBid = await bid.save();
                // Formatting Return Data
                return res.status(SUCCESS).json({
                    success: true,
                    message: label.bid.bidDeleted,
                    developerMessage: "",
                    result: bid,
                });
            } else {
                return res.status(UNAUTHORIZED).json({
                    success: false,
                    message: label.bid.notAuthorized,
                    developerMessage: label.bid.notAuthorized,
                    result: {},
                });
            }
        } else {
            throw new Error(label.bid.bidNotFound);
        }
    } catch (error) {
        console.error(error);
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: label.bid.bidDeleteError,
            developerMessage: error.message,
            result: {},
        });
    }
};

export const editBid = async (req: Request, res: Response) => {
    const bidID = req.params.bidID;
    const user = req.currentUser;
    const { amountOffered, address, remarks } = req.body;

    try {
        const bid = await Bid.findOne({ _id: bidID, isArchived: false });

        if (bid) {
            if (bid.userID.toString() === user._id.toString()) {
                bid.amountOffered = amountOffered;
                bid.address = address;
                bid.remarks = remarks;
                bid.status = "PENDING";
                const updatedBid = await bid.save();
                // Formatting Return Data
                const newBid = await Bid.findOne({ _id: bidID })
                    .populate("userID", "email fullName image")
                    .populate("belongsTo", "fullName email image");
                return res.status(SUCCESS).json({
                    success: true,
                    message: label.bid.bidEdited,
                    developerMessage: "",
                    result: newBid,
                });
            } else {
                return res.status(UNAUTHORIZED).json({
                    success: false,
                    message: label.bid.notAuthorized,
                    developerMessage: label.bid.notAuthorized,
                    result: {},
                });
            }
        } else {
            throw new Error(label.bid.bidNotFound);
        }
    } catch (error) {
        console.error(error);
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: label.bid.bidEditError,
            developerMessage: error.message,
            result: {},
        });
    }
};

export const changeBidStatus = async (req: Request, res: Response) => {
    const bidID = req.params.bidID;
    const user = req.currentUser;
    const { status } = req.body;

    try {
        const bid = await Bid.findOne({ _id: bidID, isArchived: false });

        if (bid) {
            bid.status = status;
            const updatedBid = await bid.save();
            // Formatting Return Data
            const message =
                status === "ACCEPTED"
                    ? label.bid.bidAccepted
                    : label.bid.bidRejected;

            const newBid = await Bid.findOne({ _id: bidID })
                .populate("userID", "email fullName image")
                .populate("belongsTo", "fullName email image");
            return res.status(SUCCESS).json({
                success: true,
                message,
                developerMessage: "",
                result: newBid,
            });
        } else {
            throw new Error(label.bid.bidNotFound);
        }
    } catch (error) {
        console.error(error);
        const message =
            status === "VERIFIED"
                ? label.bid.bidAcceptError
                : label.bid.bidRejectedError;
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message,
            developerMessage: error.message,
            result: {},
        });
    }
};
