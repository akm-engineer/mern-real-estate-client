import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";

const SignUp = () => {
  // State to manage form data, error, success message, and loading status
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Event handler for input changes
  const handChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // Event handler for form submission
  const handSubmit = async (e) => {
    e.preventDefault();

    // Validation checks for username, email, and password
    if (!formData.username) {
      setError("Please enter a username.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!formData.password) {
      setError("Please enter a password.");
      return;
    }
    try {
      setLoading(true);

      // Make a POST request to sign up
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      // Handle unsuccessful sign-up
      if (data.success === false) {
        setLoading(false);
        setError(data.message);
        setTimeout(() => {
          setError(null);
        }, 3000);

        return;
      }

      // Handle successful sign-up
      setLoading(false);
      setError(null);
      setSuccessMessage("Sign up successful!");

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
        navigate("/sign-in");
      }, 3000);
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center my-7 font-semibold">Sign Up</h1>
      <form className="flex flex-col gap-4">
        {/* Username input */}
        <input
          onChange={handChange}
          type="text"
          placeholder="username"
          className="border p-3 rounded-lg"
          id="username"
        />
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
        {/* Sign-up button */}
        <button
          disabled={loading}
          onClick={handSubmit}
          type="button"
          className="bg-slate-700 rounded-lg hover:opacity-95 disabled:opacity-80 text-white p-3 uppercase"
        >
          {loading ? "Loading...." : "Sign up"}
        </button>

        {/* OAuth component for alternative sign-up methods */}
        <OAuth />
      </form>
      {/* Sign-in link */}
      <div className="flex gap-2 mt-5">
        <p>Have an account?</p>
        <Link to={"/sign-in"}>
          <span className="text-blue-700 hover:underline">Sign in</span>
        </Link>
      </div>
      {error && <p className="text-red-500">{error}</p>}
      {successMessage && <p className="text-green-500">{successMessage}</p>}
    </div>
  );
};

export default SignUp;
