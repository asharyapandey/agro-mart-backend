import express from "express";
import {
    authenticateToken,
    isAdmin,
} from "../middleware/authentication.middleware";
import {
    ADD_BID_ROUTE,
    GET_BID_ROUTE,
    EDIT_BID_ROUTE,
    DELETE_BID_ROUTE,
    CHANGE_BID_STATUS_ROUTE,
} from "../constants/bid.constants";
import {
    addBid,
    changeBidStatus,
    deleteBid,
    editBid,
    searchBid,
} from "../controllers/bid.controllers";

const bidRoutes = express.Router();

bidRoutes.post(ADD_BID_ROUTE, authenticateToken, addBid);
bidRoutes.get(GET_BID_ROUTE, authenticateToken, searchBid);
bidRoutes.put(EDIT_BID_ROUTE, authenticateToken, editBid);
bidRoutes.delete(DELETE_BID_ROUTE, authenticateToken, deleteBid);
bidRoutes.patch(CHANGE_BID_STATUS_ROUTE, authenticateToken, changeBidStatus);

export default bidRoutes;
