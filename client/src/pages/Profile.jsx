/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserFailure,
  signOutUserStart,
  signOutUserSuccess,
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
} from "../redux/user/userSlice";
import { Link } from "react-router-dom";

const Profile = () => {
  // Ref for the file input
  const fileRef = useRef(null);

  // Redux state and dispatch
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  // State variables for managing file upload and form data
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerf] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);

  // Effect for handling file changes
  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);
  const handleError = (errorStateSetter, duration = 3000) => {
    errorStateSetter(true);

    // Clear error after specified duration
    setTimeout(() => {
      errorStateSetter(false);
    }, duration);
  };

  // Function to handle file upload using Firebase Storage
  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerf(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
        handleError(setFileUploadError);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(
          (downloadURL) => setFormData({ ...formData, avatar: downloadURL }),
          setFilePerf(100),
          setTimeout(() => {
            setFilePerf(0);
          }, 2500)
        );
      }
    );
  };

  // Function to handle form input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        handleError(() => dispatch(updateUserFailure(null)));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);

      setTimeout(() => {
        setUpdateSuccess(false);
      }, 3000);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
      setTimeout(() => {
        dispatch(updateUserFailure(null));
      }, 3000);
    }
  };

  // Function to handle user account deletion
  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());

      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.text();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  // Function to handle user sign out
  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  };

  // Function to fetch and display user listings
  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        handleError(() => setShowListingsError(false));
        return;
      }
      setUserListings(data);
    } catch (error) {
      setShowListingsError(true);
      handleError(() => setShowListingsError(false));
    }
  };

  // Function to handle deletion of a specific listing
  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center my-7 font-semibold">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          hidden
          ref={fileRef}
          accept="image/*"
        />
        <img
          onClick={() => fileRef.current.click()}
          className="rounded-full w-24 h-24 object-cover cursor-pointer self-center mt-2 hover:scale-105 transition-all"
          src={formData.avatar || currentUser.avatar}
          alt="profile"
        />
        <p className="text-center text-sm">
          {fileUploadError ? (
            <span className="text-red-700  font-semibold">
              Error Image upload (Image files must be less than 2mb)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-slate-700 uppercase font-semibold">{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className="text-green-800 uppercase font-semibold">
              Image Successfully Uploaded !!!
            </span>
          ) : null}
        </p>
        <input
          type="text"
          placeholder="username"
          defaultValue={currentUser.username}
          className="border p-3 rounded-lg  focus:outline-slate-400"
          id="username"
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="email"
          defaultValue={currentUser.email}
          className="border p-3 rounded-lg  focus:outline-slate-400"
          id="email"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password"
          className="border p-3 rounded-lg  focus:outline-slate-400"
          id="password"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="uppercase p-3 bg-slate-700 text-white hover:opacity-95 disabled:opacity-80 rounded-lg"
        >
          {loading ? "Loading..." : "Update"}
        </button>
        <Link
          className="flex justify-center uppercase p-3 bg-green-700 text-white hover:opacity-95 disabled:opacity-80 rounded-lg"
          to={"/create-listing"}
        >
          Create Listing
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span
          onClick={handleDeleteUser}
          className="text-red-700 cursor-pointer hover:opacity-95"
        >
          Delete Account
        </span>
        <span
          onClick={handleSignOut}
          className="text-red-700 cursor-pointer hover:opacity-95"
        >
          Sign out
        </span>
      </div>
      <p className="uppercase font-semibold text-red-700 mt-5 ">
        {error ? error + "!!!!" : ""}
      </p>
      <p className="font-semibold text-green-700 mt-5">
        {updateSuccess ? "User updated successfully" : ""}
      </p>
      <button
        onClick={handleShowListings}
        className="text-green-700 w-full hover:underline"
      >
        Show Listings
      </button>
      <p className="mt-5 text-sm text-red-700">
        {showListingsError ? "Error Showing Listyings" : ""}
      </p>
      {userListings && userListings.length > 0 && (
        <div className="flex flex-col gap-4">
          <h1 className="text-center mt-7 font-semibold text-slate-700 text-2xl">
            Your Listings
          </h1>
          {userListings.map((listing) => (
            <div
              key={listing._id}
              className="p-3 border rounded-lg flex justify-between items-center gap-4"
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt="listing cover"
                  className="w-16 h-16 object-cover rounded-lg"
                />
              </Link>
              <Link
                className="text-slate-700 font-semibold truncate hover:underline flex-1 "
                to={`/listing/${listing._id}`}
              >
                <p>{listing.name}</p>
              </Link>
              <div className="flex flex-col items-center">
                <button
                  onClick={() => handleListingDelete(listing._id)}
                  className="uppercase text-red-500 hover:opacity-75"
                >
                  Delete
                </button>
                <Link to={`/update-listing/${listing._id}`}>
                  <button className="uppercase text-green-700 hover:opacity-75">
                    Edit
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;
