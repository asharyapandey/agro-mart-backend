import express from "express";
import {
    authenticateToken,
    isAdmin,
} from "../middleware/authentication.middleware";
import {
    ADD_POST_ROUTE,
    GET_POSTS_ROUTE,
    EDIT_DELETE_POST_ROUTE,
} from "../constants/post.constants";
import {
    addPost,
    searchPost,
    editPost,
    deletePost,
} from "../controllers/post.controllers";
import { validatePostBody } from "../middleware/post.middlewares";
import { postUpload } from "../middleware/multer.middlewares";

const postRoutes = express.Router();

postRoutes.get(GET_POSTS_ROUTE, authenticateToken, searchPost);

postRoutes.post(
    ADD_POST_ROUTE,
    authenticateToken,
    postUpload.single("image"),
    // validatePostBody,
    addPost
);

postRoutes.put(
    EDIT_DELETE_POST_ROUTE,
    authenticateToken,
    validatePostBody,
    editPost
);

postRoutes.delete(EDIT_DELETE_POST_ROUTE, authenticateToken, deletePost);

export default postRoutes;
