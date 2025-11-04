const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const signToken = (id) => {
  const accessToken = jwt.sign({ id }, process.env.JWT_ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,
  });
  //   const refreshToken = jwt.sign({ id }, process.env.JWT_REFRESH_TOKEN_SECRET, {
  //     expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN,
  //   });

  return { accessToken };
};

const generateAccessToken = (req, res, next) => {
  const accessToken = jwt.sign(
    { id: req.userId },
    process.env.JWT_ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,
    }
  );

  res.status(200).json({
    status: "success",
    token: { accessToken },
  });
};

const login = async (req, res, next) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username }).select("+password");

  if (!user) {
    return res.status(401).json({ message: "incorrect username or password" });
  }
  // const pass = bcrypt.hash("123321", 10).then(console.log);

  // const isPasswordMatch = await user.comparePassword(password);
  // if (!isPasswordMatch) {
  //   return res.status(401).json({ message: "incorrect username or password" });
  // }

  const { accessToken } = signToken(user._id);

  //   user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    status: "success",
    token: { accessToken },
    data: { user },
  });
};

const logout = async (req, res, next) => {
  const user = await User.findById(req.userId);

  user.refreshToken = null;
  await user.save();

  res.status(204).json({
    status: "success",
    data: null,
  });
};

module.exports = { signToken, login, logout, generateAccessToken };
