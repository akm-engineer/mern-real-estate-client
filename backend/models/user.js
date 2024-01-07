import mongoose from "mongoose";

// Define the user schema
const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      require: "Please enter your name",

      trim: true,
      maxlength: 32,
    },
    email: {
      type: String,
      require: "Please enter a email",
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      require: "Please enter a password",
      minLength: 8,
    },
    avatar: {
      type: String,
      default:
        "https://img.freepik.com/premium-vector/accoun-vector-icon-with-long-shadow-white-illustration-isolated-blue-round-background-graphic-web-design_549897-771.jpg",
    },
  },
  { timestamps: true }
);

// Create the User model
const User = mongoose.model("User", userSchema);

export default User;
