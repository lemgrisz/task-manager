const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const generateToken = (id, name, email) => {
  return jwt.sign({ id, name, email }, process.env.JWT_SECRET, {
    expiresIn: "2h",
  });
};

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error registering user", error: error.message });
    console.log(error);
  }
};

exports.loginUser = async (req, res) => {
  console.log(req.body, "user creds");
  try {
    const { email, password } = req.body;

    const user = await User.findOne({email});
    console.log(user, "array");

    if (user && (await bcrypt.compare(password, user.password))) {
      token = await generateToken(user._id, user.name, user.email);
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token,
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
    console.log(error);
  }
};
