import { Request, Response, NextFunction } from "express";
import {
    CREATED,
    INTERNAL_SERVER_ERROR,
    SUCCESS,
} from "../constants/status-codes.constants";
import label from "../label/label";
import Bid from "../models/Bid.model";
import { CategoryDocument } from "../models/Category.model";
import Post, { PostDocument } from "../models/Post.model";
import { ProductDocument } from "../models/Product.model";
import { UnitDocument } from "../models/Unit.model";
import { UserDocument } from "../models/User.model";

export const searchPost = async (req: Request, res: Response) => {
    const page: number = parseInt(req?.query.page as string) || 1;
    const limit: number = parseInt(req?.query.limit as string) || 0;

    const searchTerm = req?.query?.searchTerm as string;

    const query = {
        name: new RegExp(searchTerm, "i"),
        isArchived: false,
    };

    try {
        const postFound = await Post.find(query)
            .sort({ createdAt: -1 })
            .skip(page * limit - limit)
            .limit(limit)
            .populate("userID", "fullName email image")
            .populate({ path: "product", populate: { path: "category unit" } });
        const totalPosts = await Post.countDocuments(query);

        if (postFound && totalPosts > 0) {
            // Formatting Return Data
            const trimmedResult = await Promise.all(
                postFound.map(async (post) => {
                    const product = post.product as ProductDocument;
                    const totalBids = await Bid.countDocuments({
                        post: post._id,
                    });
                    return {
                        _id: post.id,
                        farmerPrice: post.farmerPrice,
                        image: post.image,
                        name: post.name,
                        address: post.address,
                        description: post.description,
                        user: post.userID,
                        createdAt: post.createdAt,
                        unit: (product.unit as UnitDocument).displayName,
                        category: (product.category as CategoryDocument)
                            .displayName,
                        productName: product.productName,
                        kalimatiPrice: product.kalimatiPrice,
                        totalBids,
                    };
                })
            );
            return res.status(SUCCESS).json({
                success: true,
                message: label.post.postFetched,
                developerMessage: "",
                result: trimmedResult,
                page,
                totalCount: totalPosts,
            });
        } else {
            return res.status(SUCCESS).json({
                success: true,
                message: label.post.postFetched,
                developerMessage: "",
                result: [],
                page,
                totalCount: totalPosts,
            });
        }
    } catch (error) {
        console.error(error);
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: label.post.postFetchError,
            developerMessage: error.message,
            result: [],
        });
    }
};

export const addPost = async (req: Request, res: Response) => {
    const { product, name, farmerPrice, address, description } = req.body;

    try {
        let image = "";
        if (req.file) {
            image = req.file.path;
        }
        const postObj = new Post({
            product,
            image,
            name,
            farmerPrice: parseFloat(farmerPrice),
            address,
            description,
            userID: req.currentUser._id,
        });
        let post = await postObj.save();
        post = (await Post.findOne({ _id: post._id })
            .populate("userID", "fullName email image")
            .populate({
                path: "product",
                populate: { path: "category unit" },
            })) as PostDocument;

        if (post) {
            // Formatting Return Data
            const product = post.product as ProductDocument;
            const postData = {
                _id: post.id,
                farmerPrice: post.farmerPrice,
                image: post.image,
                name: post.name,
                address: post.address,
                description: post.description,
                user: post.userID,
                createdAt: post.createdAt,
                unit: (product.unit as UnitDocument).displayName,
                category: (product.category as CategoryDocument).displayName,
                productName: product.productName,
                kalimatiPrice: product.kalimatiPrice,
            };
            return res.status(CREATED).json({
                success: true,
                message: label.post.postAdded,
                developerMessage: "",
                result: postData,
            });
        }
    } catch (error) {
        console.error(error);
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: label.post.postAddError,
            developerMessage: error.message,
            result: {},
        });
    }
};

export const deletePost = async (req: Request, res: Response) => {
    const postID = req.params.postID;
    const user = req.currentUser;

    try {
        const post = await Post.findOne({
            _id: postID,
            isArchived: false,
        })
            .populate("userID", "fullName email image")
            .populate({ path: "product", populate: { path: "category unit" } });

        if (post) {
            const postUser = post.userID as UserDocument;
            if (postUser._id.toString() === user._id.toString()) {
                post.isArchived = true;
                const deletedPost = await post.save();
                // Formatting Return Data
                const product = post.product as ProductDocument;
                const postData = {
                    _id: post.id,
                    farmerPrice: post.farmerPrice,
                    image: post.image,
                    name: post.name,
                    address: post.address,
                    description: post.description,
                    user: post.userID,
                    createdAt: post.createdAt,
                    unit: (product.unit as UnitDocument).displayName,
                    category: (product.category as CategoryDocument)
                        .displayName,
                    productName: product.productName,
                    kalimatiPrice: product.kalimatiPrice,
                };
                return res.status(SUCCESS).json({
                    success: true,
                    message: label.post.postDeleted,
                    developerMessage: "",
                    result: postData,
                });
            } else {
                return res.status(INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: label.post.notAuthorized,
                    developerMessage: label.post.notAuthorized,
                    result: {},
                });
            }
        } else {
            throw new Error(label.post.postNotFound);
        }
    } catch (error) {
        console.error(error);
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: label.post.postDeleteError,
            developerMessage: error.message,
            result: {},
        });
    }
};

export const editPost = async (req: Request, res: Response) => {
    const postID = req.params.postID;
    const { product, image, name, farmerPrice, address, description } =
        req.body;
    const user = req.currentUser;

    try {
        const currentPost = await Post.findOne({
            _id: postID,
            isArchived: false,
        });

        if (currentPost) {
            if (currentPost.userID.toString() === user._id.toString()) {
                currentPost.product = product;
                currentPost.name = name;
                currentPost.image = image;
                currentPost.farmerPrice = farmerPrice;
                currentPost.address = address;
                currentPost.description = description;

                const updatedPost = await currentPost.save();
                const post = (await Post.findOne({ _id: updatedPost._id })
                    .populate("userID", "fullName email image")
                    .populate({
                        path: "product",
                        populate: { path: "category unit" },
                    })) as PostDocument;
                console.log(post);
                // Formatting Return Data
                const postProduct = post.product as ProductDocument;
                const postData = {
                    _id: post.id,
                    farmerPrice: post.farmerPrice,
                    image: post.image,
                    name: post.name,
                    address: post.address,
                    description: post.description,
                    user: post.userID,
                    createdAt: post.createdAt,
                    unit: (postProduct.unit as UnitDocument).displayName,
                    category: (postProduct.category as CategoryDocument)
                        .displayName,
                    productName: postProduct.productName,
                    kalimatiPrice: postProduct.kalimatiPrice,
                };
                return res.status(SUCCESS).json({
                    success: true,
                    message: label.post.postUpdated,
                    developerMessage: "",
                    result: postData,
                });
            } else {
                return res.status(INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: label.post.notAuthorized,
                    developerMessage: label.post.notAuthorized,
                    result: {},
                });
            }
        } else {
            throw new Error(label.post.postNotFound);
        }
    } catch (error) {
        console.error(error);
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: label.post.postUpdateError,
            developerMessage: error.message,
            result: {},
        });
    }
};
