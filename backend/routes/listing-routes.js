import express from "express";
const listingRoutes = express.Router();
import authMiddlewares from '../middlewares/auth-middlewares.js'
import upload from "../middlewares/multer-middlewares.js";
import {addListing, getListing, findListing, updateListing, deleteListing, search } from "../controllers/Listing-controllers.js";

listingRoutes.route("/add").post(authMiddlewares, upload.fields([
    {name:"image1", maxCount:1},
    {name:"image2", maxCount:1},
    {name:"image3", maxCount:1},
]), addListing)

listingRoutes.route("/all-list").get(getListing)

listingRoutes.route("/view/:listId").get(findListing)

//update Routes
listingRoutes.route("/edit-listing/:listId").post(authMiddlewares, upload.fields([
    {name:"image1", maxCount:1},
    {name:"image2", maxCount:1},
    {name:"image3", maxCount:1},
]), updateListing)

//delete Routes
listingRoutes.route("/delete/:listId").get(deleteListing)

//search
listingRoutes.route("/search").get(search)


export default listingRoutes