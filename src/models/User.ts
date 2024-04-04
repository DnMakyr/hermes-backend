import mongoose, { Model, Schema } from "mongoose";

interface IProfile extends mongoose.Document {
  fullName: string;
  bio?: string;
}

const profileSchema: Schema<IProfile> = new Schema({
  fullName: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    default: "",
  },
});

const Profile: Model<IProfile> = mongoose.model("Profile", profileSchema);

interface IUser extends mongoose.Document {
  email: string;
  username: string;
  password: string;
  profile: IProfile;
  createdAt: Date;
}

const userSchema: Schema<IUser> = new Schema({
  email: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
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

const User: Model<IUser> = mongoose.model("User", userSchema);

export { User, Profile };
