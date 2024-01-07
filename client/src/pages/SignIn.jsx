import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  signInFailure,
  signInStart,
  signInSuccess,
} from "../redux/user/userSlice";
import OAuth from "../components/OAuth";

const SignIn = () => {
  // State to manage form data
  const [formData, setFormData] = useState({});

  // Redux state and dispatch
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Event handler for input changes
  const handChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // Event handler for form submission
  const handSubmit = async (e) => {
    e.preventDefault();

    try {
      // Dispatch sign-in start action
      dispatch(signInStart());

      // Make a POST request to sign in
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      // Parse response
      const data = await res.json();

      // Handle unsuccessful sign-in
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        setTimeout(() => {
          dispatch(signInFailure(null));
        }, 3000);
        return;
      }

      dispatch(signInSuccess(data));
      navigate("/");
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center my-7 font-semibold">Sign In</h1>
      <form className="flex flex-col gap-4">
        {/* Email input */}
        <input
          onChange={handChange}
          type="email"
          placeholder="email"
          className="border p-3 rounded-lg"
          id="email"
        />
        {/* Password input */}
        <input
          onChange={handChange}
          type="password"
          placeholder="password"
          className="border p-3 rounded-lg"
          id="password"
        />
        {/* Sign-in button */}
        <button
          disabled={loading}
          onClick={handSubmit}
          type="button"
          className="bg-slate-700 rounded-lg hover:opacity-95 disabled:opacity-80 text-white p-3 uppercase"
        >
          {loading ? "Loading...." : "Sign in"}
        </button>
        {/* OAuth component for alternative sign-in methods */}
        <OAuth />
      </form>
      {/* Sign-up link */}
      <div className="flex gap-2 mt-5">
        <p>Dont have an account?</p>
        <Link to={"/sign-up"}>
          <span className="text-blue-700 hover:underline">Sign up</span>
        </Link>
      </div>

      {/* Display error message if there's an error */}
      {error && <p className="text-red-500 font-semibold ">{error}</p>}
    </div>
  );
};

export default SignIn;
