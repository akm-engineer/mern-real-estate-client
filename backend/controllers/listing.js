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
export const updateListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) return next(errorHandler(401, "Listing not found..."));

  if (req.user.id !== listing.userRef)
    return next(errorHandler(404, "You can update your own listing only"));

  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    return res.status(201).json(updatedListing);
  } catch (error) {
    next(error);
  }
};
export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return next(errorHandler(401, "Listing not found..."));
    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};
export const searchListing = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;

    let offer = req.query.offer;
    if (offer === undefined && offer === "false") {
      offer = { $in: [false, true] };
    }

    const furnished = req.query.furnished;
    if (furnished === undefined && furnished === "false") {
      furnished = { $in: [false, true] };
    }

    let parking = req.query.parking;
    if (parking === undefined && parking === "false") {
      parking = { $in: [false, true] };
    }

    let type = req.query.type;
    if (type === undefined && type === "all") {
      type = { $in: ["sale", "rent"] };
    }

    const searchTerm = req.query.searchTerm || "";

    const sort = req.query.sort || "createdAt";

    const order = req.query.order || "desc";

    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: "i" },
      offer,
      parking,
      type,
      furnished,
    })
      .sort({
        [sort]: order,
      })
      .limit(limit)
      .skip(startIndex);

    return res.status(201).json(listings);
  } catch (error) {
    next(error);
  }
};
