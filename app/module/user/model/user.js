const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "candidate"],
      required: true,
    },
    mobile: { type: String, required: true },
    profile_img: { type: String, required: true },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, versionKey: false }
);
const UserModel = mongoose.model("User", userSchema);
module.exports = UserModel;
