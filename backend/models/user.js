import mongoose from "mongoose";

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
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
