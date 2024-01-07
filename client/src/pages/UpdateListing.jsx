/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { app } from "../firebase";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

const CreateListing = () => {
  // Fetching user information from Redux state
  const { currentUser } = useSelector((state) => state.user);

  // State variables to manage form data, image uploads, and loading state
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();
  const params = useParams();
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountedPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  const [imageUploadErrors, setImageUploadErrors] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch listing information for editing
  useEffect(() => {
    const fetchListing = async () => {
      const listingId = params.listingId;
      const res = await fetch(`/api/listing/get/${listingId}`);
      const data = await res.json();
      setFormData(data);
      if (data.success === false) {
        console.log(data.message);
      }
    };
    fetchListing();
  }, []);

  // Handle image upload
  const handleImageSubmit = () => {
    if (files.length === 0) {
      setImageUploadErrors("Please select at least one image to upload.");
      return;
    }
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadErrors(false);
      const promises = [];
      for (let i = 0; i < files.length; i++) {
        promises.push(storageImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadErrors(false);
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadErrors(
            "Image upload failed (max 2mb is allowed per image)"
          );
          setUploading(false);
        });
    } else {
      setImageUploadErrors("You can only add up to 6 images.");
      setUploading(false);
    }
  };

  // Function to upload image to Firebase Storage
  const storageImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  // Handle removing an image from the listing
  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
    setFiles((prevFiles) => {
      const updatedFiles = [...prevFiles];
      updatedFiles.splice(index, 1);
      return updatedFiles;
    });
  };

  // Handle form input changes
  const handleChange = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }
    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }
    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validation checks
      if (formData.imageUrls.length < 1)
        return setError("You must upload a image");
      if (+formData.regularPrice < +formData.discountedPrice)
        return setError("Discounted Price must be lower than Regular price");

      setLoading(true);
      setError(false);

      // Send request to update listing
      const res = await fetch(`/api/listing/update/${params.listingId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });

      const data = await res.json();

      setLoading(false);

      if (data.success === false) {
        setError(data.message);
      }

      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Update a Listing
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            required
            maxLength={"50"}
            min={"6"}
            className="p-3 rounded-lg border focus:outline-none"
            id="name"
            onChange={handleChange}
            value={formData.name}
          />
          <textarea
            type="text"
            onChange={handleChange}
            value={formData.description}
            placeholder="Description"
            required
            className="p-3 rounded-lg border focus:outline-none"
            id="description"
          />
          <input
            type="text"
            onChange={handleChange}
            value={formData.address}
            placeholder="Address"
            required
            className="p-3 rounded-lg border focus:outline-none"
            id="address"
          />
          <div className="flex gap-7 flex-wrap">
            <div className="flex gap-4">
              <input
                type="checkbox"
                className="w-5 "
                id="sale"
                onChange={handleChange}
                checked={formData.type === "sale"}
              />
              <span>Sale</span>
            </div>
            <div className="flex gap-4">
              <input
                type="checkbox"
                className="w-5 "
                id="rent"
                onChange={handleChange}
                checked={formData.type === "rent"}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-4">
              <input
                type="checkbox"
                className="w-5 "
                id="parking"
                onChange={handleChange}
                checked={formData.parking}
              />
              <span>Parking Spot</span>
            </div>
            <div className="flex gap-4">
              <input
                type="checkbox"
                className="w-5 "
                id="furnished"
                onChange={handleChange}
                checked={formData.furnished}
              />
              <span>Furnished</span>
            </div>
            <div className="flex gap-4">
              <input
                type="checkbox"
                className="w-5 "
                id="offer"
                onChange={handleChange}
                checked={formData.offer}
              />
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
                onChange={handleChange}
                value={formData.bedrooms}
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
                onChange={handleChange}
                value={formData.bathrooms}
                required
                className="border border-gray-300 focus:outline-gray-300 p-2 rounded-lg"
              />
              <p>Baths</p>
            </div>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                min={"50"}
                max={"100000000"}
                id="regularPrice"
                required
                onChange={handleChange}
                value={formData.regularPrice}
                className="border border-gray-300 focus:outline-gray-300 p-2 rounded-lg"
              />
              <div className="flex items-center flex-col">
                <p>Regular Price </p>
                {formData.type === "rent" && (
                  <span className="text-xs">($ / month)</span>
                )}
              </div>
            </div>
            {formData.offer && (
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  min={"0"}
                  max={"1000000"}
                  id="discountedPrice"
                  onChange={handleChange}
                  value={formData.discountedPrice}
                  required
                  className="border border-gray-300 focus:outline-gray-300 p-2 rounded-lg"
                />
                <div className="flex items-center flex-col">
                  <p>Discounted Price </p>
                  {formData.type === "rent" && (
                    <span className="text-xs">($ / month)</span>
                  )}
                </div>
              </div>
            )}
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
              onChange={(e) => setFiles(e.target.files)}
              className=" p-3 border  rounded-lg border-gray-300 w-full"
              type="file"
              id="images"
              multiple
              accept="image/*"
            />
            <button
              type="button"
              disabled={uploading}
              onClick={handleImageSubmit}
              className="uppercase p-3 border text-green-700 rounded-lg border-green-700 hover:shadow-lg disabled:opacity-80"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
          <p className="text-red-700 text-sm">
            {imageUploadErrors && imageUploadErrors}
          </p>
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div
                key={url}
                className="flex justify-between p-3 border items-center rounded-lg border-slate-300"
              >
                <img
                  src={url}
                  alt="listing "
                  className="w-20 h-20 object-contain rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="text-red-600 uppercase hover:opacity-75 text-center"
                >
                  Delete
                </button>
              </div>
            ))}
          <button
            disabled={loading || uploading}
            className="p-3 uppercase disabled:opacity-80 text-white hover:opacity-95 bg-slate-700 rounded-lg"
          >
            {loading ? "Updating...." : "Update Listing"}
          </button>
          {error && <p className="text-sm text-red-700">{error}</p>}
        </div>
      </form>
    </main>
  );
};

export default CreateListing;
