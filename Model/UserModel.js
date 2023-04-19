const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is Required"],
  },
  email: {
    type: String,
    required: [true, "Email is Required"],
    unique: [true, "Email already registered"],
  },
  password: {
    type: String,
    required: [true, "Password is Required"],
    select: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
    select: false,
  },
});

// DOCUMENT MIDDLEWARE
userSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 10);
});

const User = mongoose.model("User", userSchema);
module.exports = User;
