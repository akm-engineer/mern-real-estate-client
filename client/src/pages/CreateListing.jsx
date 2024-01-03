import React, { useState } from "react";
import { app } from "../firebase";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

const CreateListing = () => {
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
  });
  const [imageUploadErrors, setImageUploadErrors] = useState(false);
  const [uploading, setUploading] = useState(false);
  console.log(formData);

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
  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };
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
          <button className="p-3 uppercase disabled:opacity-80 text-white hover:opacity-95 bg-slate-700 rounded-lg">
            Create Listing
          </button>
        </div>
      </form>
    </main>
  );
};

export default CreateListing;
