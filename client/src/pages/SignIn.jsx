import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  signInFailure,
  signInStart,
  signInSuccess,
} from "../redux/user/userSlice";

const SignIn = () => {
  const [formData, setFormData] = useState({});
  // const [error, setError] = useState(null);
  // const [loading, setLoading] = useState(false);
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const handSubmit = async (e) => {
    e.preventDefault();

    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // if (!formData.email || !emailRegex.test(formData.email)) {
    //   setError("Please enter a valid email address.");
    //   return;
    // }

    // if (!formData.password) {
    //   setError("Please enter a password.");
    //   return;
    // }
    try {
      dispatch(signInStart());
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        // setLoading(false);
        // setError(data.message);
        dispatch(signInFailure(data.message));
        return;
      }
      // setLoading(false);
      // setError(null);
      dispatch(signInSuccess(data));
      navigate("/");
    } catch (error) {
      // setLoading(false);
      // setError(error.message);
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center my-7 font-semibold">Sign In</h1>
      <form className="flex flex-col gap-4">
        <input
          onChange={handChange}
          type="email"
          placeholder="email"
          className="border p-3 rounded-lg"
          id="email"
        />
        <input
          onChange={handChange}
          type="password"
          placeholder="password"
          className="border p-3 rounded-lg"
          id="password"
        />
        <button
          disabled={loading}
          onClick={handSubmit}
          type="button"
          className="bg-slate-700 rounded-lg hover:opacity-95 disabled:opacity-80 text-white p-3 uppercase"
        >
          {loading ? "Loading...." : "Sign in"}
        </button>
      </form>
      <div className="flex gap-2 mt-5">
        <p>Dont have an account?</p>
        <Link to={"/sign-up"}>
          <span className="text-blue-700 hover:underline">Sign up</span>
        </Link>
      </div>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default SignIn;
