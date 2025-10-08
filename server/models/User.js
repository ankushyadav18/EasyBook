import mongoose from "mongoose";
import { type } from "./../node_modules/@types/whatwg-url/index.d";

const userSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  image: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

export default User;
