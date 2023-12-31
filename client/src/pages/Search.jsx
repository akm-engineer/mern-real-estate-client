/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ListingItem from "../components/ListingItem";

const Search = () => {
  // Hook to navigate between pages
  const navigate = useNavigate();

  // State to manage search parameters and results
  const [sideBarData, setSideBarData] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "created_at",
    order: "desc",
  });
  const [loading, setLoading] = useState(false);
  const [listing, setListing] = useState([]);
  const [showMore, setShowMore] = useState(false);

  // Effect to fetch listings based on URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTermUrl = urlParams.get("searchTerm");
    const typeFromUrl = urlParams.get("type");
    const parkingFromUrl = urlParams.get("parking");
    const furnishedFromUrl = urlParams.get("furnished");
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");
    const offerFromUrl = urlParams.get("offer");

    if (
      searchTermUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      sortFromUrl ||
      orderFromUrl ||
      offerFromUrl
    ) {
      setSideBarData({
        searchTerm: searchTermUrl || "",
        type: typeFromUrl || "all",
        parking: parkingFromUrl === "true" ? true : false,
        furnished: furnishedFromUrl === "true" ? true : false,
        sort: sortFromUrl || "created_at",
        order: orderFromUrl || "desc",
        offer: offerFromUrl === "true" ? true : false,
      });
    }
    const fetchListings = async () => {
      setLoading(true);
      setShowMore(false);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/listing/get?${searchQuery}`);
      const data = await res.json();
      if (data.length > 8) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
      setListing(data);
      setLoading(false);
    };
    fetchListings();
  }, [window.location.search]);

  // Event handler for form input changes
  const handleChange = (e) => {
    if (
      e.target.id === "all" ||
      e.target.id === "rent" ||
      e.target.id === "sale"
    ) {
      setSideBarData({ ...sideBarData, type: e.target.id });
    }

    if (e.target.id === "searchTerm") {
      setSideBarData({ ...sideBarData, searchTerm: e.target.value });
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setSideBarData({
        ...sideBarData,
        [e.target.id]:
          e.target.checked || e.target.checked === "true" ? true : false,
      });
    }

    if (e.target.id === "sort_order") {
      const sort = e.target.value.split("_")[0] || "created_at";
      const order = e.target.value.split("_")[1] || "desc";
      setSideBarData({ ...sideBarData, sort, order });
    }
  };

  // Event handler for form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", sideBarData.searchTerm);
    urlParams.set("type", sideBarData.type);
    urlParams.set("parking", sideBarData.parking);
    urlParams.set("furnished", sideBarData.furnished);
    urlParams.set("order", sideBarData.order);
    urlParams.set("sort", sideBarData.sort);
    urlParams.set("offer", sideBarData.offer);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  // Event handler for "Show More" button click
  const onShowMoreClick = async () => {
    const numberOfListings = listing.length;
    const startIndex = numberOfListings;
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/listing/get?${searchQuery}`);
    const data = await res.json();
    if (data.length < 9) {
      setShowMore(false);
    }
    setListing([...listing, ...data]);
  };
  return (
    <div className="flex flex-col md:flex-row">
      {/* Sidebar for search filters */}
      <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          {/* Search term input */}
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">
              Search Terms:
            </label>
            <input
              type="text"
              id="searchTerm"
              placeholder="Search.."
              value={sideBarData.searchTerm}
              onChange={handleChange}
              className="p-3 w-full border border-slate-400 rounded-lg focus:outline-none"
            />
          </div>

          {/* Type checkboxes (Rent, Sale, All) */}
          <div className="flex gap-2 items-center flex-wrap">
            <label className="font-semibold">Type:</label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="all"
                className="w-5"
                checked={sideBarData.type === "all"}
                onChange={handleChange}
              />
              <span>Rent & Sale</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                checked={sideBarData.type === "rent"}
                onChange={handleChange}
              />
              <span>Rent </span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                checked={sideBarData.type === "sale"}
                onChange={handleChange}
              />
              <span>Sale</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                checked={sideBarData.offer}
                onChange={handleChange}
              />
              <span>Offer</span>
            </div>
          </div>

          {/* Amenities checkboxes (Parking, Furnished) */}
          <div className="flex gap-2 items-center flex-wrap">
            <label className="font-semibold">Amenties:</label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                checked={sideBarData.parking}
                onChange={handleChange}
              />
              <span>Parking</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                checked={sideBarData.furnished}
                onChange={handleChange}
              />
              <span>Furnished </span>
            </div>
          </div>

          {/* Sorting options */}
          <div className="flex items-center gap-2">
            <label className="font-semibold">Sort:</label>
            <select
              defaultValue={"created_At_desc"}
              onChange={handleChange}
              id="sort_order"
              className="p-2 border border-slate-400 rounded-lg focus:outline-none"
            >
              <option value="regularPrice_desc">Price high to low</option>
              <option value="regularPrice_asc">Price low to high</option>
              <option value="createdAt_desc">Latest</option>
              <option value="createdAt_asc">Oldest</option>
            </select>
          </div>
          <button className="p-3 text-white uppercase bg-slate-700 hover:opacity-95  rounded-lg">
            Search
          </button>
        </form>
      </div>

      {/* Displaying search results */}
      <div className="flex-1">
        <h1 className="text-slate-700 font-semibold text-3xl border-b p-3 mt-5">
          Listing Results:{" "}
        </h1>
        <div className="p-7 flex flex-wrap gap-4">
          {/* No listings found message */}
          {!loading && listing.length === 0 && (
            <p className="text-3xl text-red-700">
              No Listing Found....🥺🥺🥺🥺
            </p>
          )}
          {/* Loading message */}
          {loading && (
            <p className="text-2xl text-slate-700 text-center w-full">
              Loading 🧐🧐🧐🧐🧐
            </p>
          )}
          {/* Displaying listings */}
          {!loading &&
            listing &&
            listing.map((list) => (
              <ListingItem key={list._id} listing={list} />
            ))}

          {/* Show More button */}
          {showMore && (
            <button
              className="text-green-700 hover:underline font-semibold text-sm text-center w-full "
              onClick={onShowMoreClick}
            >
              Show More
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
