import mongoose, { Model, Schema } from "mongoose";

// interface IProfile extends mongoose.Document {
//   fullName: string;
//   bio?: string;
// }

const profileSchema = new Schema({
  fullName: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    default: "",
  },
});

const Profile = mongoose.model("Profile", profileSchema);

// interface IUser extends mongoose.Document {
//   email: string;
//   username: string;
//   password: string;
//   profile: IProfile;
//   createdAt: Date;
// }

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  authentication: {
    password: {
      type: String,
      required: true,
      select: false,
    },
    googleId: {
      type: String,
      select: false,
    },
    salt: {
      type: String,
      select: false,
    },
  },
  profile: {
    type: Schema.Types.ObjectId,
    ref: "Profile",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", userSchema);

export { User, Profile };
