import Listing from "../models/listing.js";
import { errorHandler } from "../utils/error.js";

export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};
export const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) return next(errorHandler(401, "Listing not found..."));

  if (req.user.id !== listing.userRef)
    return next(errorHandler(404, "You can delete your own listing only"));

  try {
    await Listing.findByIdAndDelete(req.params.id);
    return res.status(201).json("Listing has been Deleted");
  } catch (error) {
    next(error);
  }
};
