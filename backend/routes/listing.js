import express from "express";
import {
  createListing,
  deleteListing,
  updateListing,
  getListing,
  searchListing,
} from "../controllers/listing.js";
import { verifyToken } from "../utils/verifyUser.js";

const listingRouter = express.Router();

listingRouter.post("/create", verifyToken, createListing);
listingRouter.delete("/delete/:id", verifyToken, deleteListing);
listingRouter.post("/update/:id", verifyToken, updateListing);
listingRouter.get("/get/:id", verifyToken, getListing);
listingRouter.get("/get", searchListing);

export default listingRouter;
