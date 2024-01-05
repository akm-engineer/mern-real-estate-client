import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";
import { FaBath, FaBed } from "react-icons/fa";

const ListingItem = ({ listing }) => {
  return (
    <div className="bg-slate-200 shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[330px] ">
      <Link to={`/listing/${listing._id}`}>
        <img
          src={listing.imageUrls[0]}
          alt="listing cover"
          className="h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300"
        />
        <div className="p-3 flex flex-col gap-3 w-full">
          <p className="text-slate-700 font-semibold truncate text-lg">
            {listing.name}
          </p>
          <div className="flex gap-2  items-center">
            <MdLocationOn className="text-green-700 h-4 w-4" />
            <p className="text-sm text-gray-600  truncate ">
              {listing.address}
            </p>
          </div>
          <p className="text-sm line-clamp-2 text-slate-600">
            {listing.description}
          </p>
          <p className="font-semibold text-lg text-slate-500 mt-2">
            {" "}
            $
            {listing.offer
              ? listing.discountedPrice.toLocaleString("en-US")
              : listing.regularPrice.toLocaleString("en-US")}
            {listing.type === "rent" && "/ month"}
          </p>
          <div className="flex items-center justify-center gap-8 font-semibold text-slate-700 text-sm">
            <div className="flex items-center">
              <FaBed className="text-green-700 h-4 w-4" />{" "}
              {listing.bedrooms > 1
                ? `${listing.bedrooms} beds`
                : `${listing.bedrooms} bed`}
            </div>
            <div className="flex items-center">
              <FaBath className="text-green-700 h-4 w-4" />{" "}
              {listing.bathrooms > 1
                ? `${listing.bathrooms} baths`
                : `${listing.bathrooms} bath`}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ListingItem;
