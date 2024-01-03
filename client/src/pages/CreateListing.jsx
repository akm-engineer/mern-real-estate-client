import React from "react";

const CreateListing = () => {
  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create a Listing
      </h1>
      <form className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            required
            maxLength={"50"}
            min={"6"}
            className="p-3 rounded-lg border focus:outline-none"
            id="name"
          />
          <textarea
            type="text"
            placeholder="Description"
            required
            className="p-3 rounded-lg border focus:outline-none"
            id="description"
          />
          <input
            type="text"
            placeholder="Adress"
            required
            className="p-3 rounded-lg border focus:outline-none"
            id="address
            "
          />
          <div className="flex gap-7 flex-wrap">
            <div className="flex gap-4">
              <input type="checkbox" className="w-5 " id="sale" />
              <span>Sale</span>
            </div>
            <div className="flex gap-4">
              <input type="checkbox" className="w-5 " id="rent" />
              <span>Rent</span>
            </div>
            <div className="flex gap-4">
              <input type="checkbox" className="w-5 " id="parking" />
              <span>Parking Spot</span>
            </div>
            <div className="flex gap-4">
              <input type="checkbox" className="w-5 " id="furnished" />
              <span>Furnished</span>
            </div>
            <div className="flex gap-4">
              <input type="checkbox" className="w-5 " id="offer" />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-8">
            <div className="flex gap-2 items-center">
              <input
                type="number"
                min={"1"}
                max={"10"}
                required
                id="bedrooms"
                className="border border-gray-300 focus:outline-gray-300 p-2 rounded-lg"
              />
              <p>Beds</p>
            </div>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                min={"1"}
                max={"5"}
                id="bathrooms"
                required
                className="border border-gray-300 focus:outline-gray-300 p-2 rounded-lg"
              />
              <p>Baths</p>
            </div>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                min={"0"}
                max={"10"}
                id="regularPrice"
                required
                className="border border-gray-300 focus:outline-gray-300 p-2 rounded-lg"
              />
              <div className="flex items-center flex-col">
                <p>Regular Price </p>
                <span className="text-sm">($ /month)</span>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                min={"0"}
                max={"10"}
                id="discountPrice"
                required
                className="border border-gray-300 focus:outline-gray-300 p-2 rounded-lg"
              />
              <div className="flex items-center flex-col">
                <p>Discounted Price </p>
                <span className="text-sm">($ /month)</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex  flex-col flex-1 gap-4">
          <p className="font-semibold">
            Images :{" "}
            <span className="font-normal text-gray-600 ml-2">
              The first image is for cover (max:6)
            </span>
          </p>
          <div className="flex gap-6 ">
            <input
              className=" p-3 border  rounded-lg border-gray-300 w-full"
              type="file"
              id="images"
              multiple
              accept="image/*"
            />
            <button className="uppercase p-3 border text-green-700 rounded-lg border-green-700 hover:shadow-lg disabled:opacity-80">
              Upload
            </button>
          </div>
          <button className="p-3 uppercase disabled:opacity-80 text-white hover:opacity-95 bg-slate-700 rounded-lg">
            Create Listing
          </button>
        </div>
      </form>
    </main>
  );
};

export default CreateListing;
