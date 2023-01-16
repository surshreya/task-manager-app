const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Create User Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate(val) {
      if (!validator.isEmail(val)) {
        throw new Error("Please provide a valid email address.");
      }
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minLength: 7,
    validate(password) {
      if (password.toLowerCase().includes("password")) {
        throw new Error('Password cannot contain "password"');
      }
    },
  },
  age: {
    type: Number,
    default: 0,
    validate(value) {
      if (value < 0) {
        throw new Error("Age must be positive.");
      }
    },
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

//Available on instances of the model
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  console.log(process.env.JWT_SECRET);
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);

  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

// Static Method to find user by their login specific credentials
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Unable to login");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Unable to login");
  }

  return user;
};

// Hash the plain text password before saving
userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

// Create User Model
const User = mongoose.model("User", userSchema);

module.exports = User;
