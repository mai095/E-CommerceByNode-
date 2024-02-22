import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
      min: 3,
      max: 10,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin", "seller"],
      lowerCase: true,
      default: "user",
    },
    gender: {
      type: String,
      enum: ["male", "female", "Male", "Female"],
      lowerCase: true,
    },
    phone: {
      type: String,
    },
    age: {
      type: Number,
      min: 18,
      max: 90,
    },
    isConfirmed: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    forgetCode: {
      type: String,
    },
    profilePic: {
      id: {
        type: String,
        default:
          "E-Commerce/Users/Defaults/ProfilePicture/default-user-profile_tvws9v",
      },
      url: {
        type: String,
        default:
          "https://res.cloudinary.com/dmq2km3vq/image/upload/v1706005545/E-Commerce/Users/Defaults/ProfilePicture/default-user-profile_tvws9v.avif",
      },
    },
    coverPics: [
      {
        id: { type: String },
        url: { type: String },
      },
    ],
  },
  { timeseries: true }
);

// ~hook ===> to save hashed password
userSchema.pre("save", function () {
  if (this.isModified("password")) {
    //check any change in document password
    this.password = bcrypt.hashSync(
      this.password,
      parseInt(process.env.SALT_ROUND)
    );
  }
});

export const userModel = model("User", userSchema);
