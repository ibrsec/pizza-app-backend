"use strict";

const { passwordEncryptor } = require("../helpers/passwordEncrypt");
const { User } = require("../models/user");
const { Token } = require("../models/token");

/* -------------------------------------------------------
    | FULLSTACK TEAM | NODEJS / EXPRESS |
------------------------------------------------------- */

module.exports.auth = {
  login: async (req, res) => {
    /**
     * #swagger.tags = ['Authentication'],
     * #swagger.summary = Login
     * #swagger.description = Login with Email/username and password.
     */
    const { username, password, email } = req.body;
    if (!(username || email) || !password) {
      res.errorStatusCode = 400;
      throw new Error("Username/Email and password is required for login!");
    }

    const user = await User.findOne({ $or: [{ username }, { email }] });
    if (!user) {
      res.errorStatusCode = 401;
      throw new Error("Unauthorized - User not Found!");
    }

    if (user.password !== passwordEncryptor(password)) {
      res.errorStatusCode = 401;
      throw new Error("Unauthorized - Invalid password!");
    }

    if (!user?.isActive) {
      res.errorStatusCode = 401;
      throw new Error("Unauthorized - this user is not a active user!");
    }

    //check token is exist
    let tokenData = await Token.findOne({ userId: user?._id });
    if (!tokenData) {
      //if not create one
      tokenData = await Token.create({
        userId: user._id,
        token: passwordEncryptor(user?._id + new Date().getTime()),
      });
    }

    res.json({
      error: false,
      message: "Login is OK!",
      result: {
        userId: tokenData.userId,
        token: tokenData?.token,
      },
    });
  },
  logout: async (req, res) => {
    /**
     * #swagger.tags = ['Authentication'],
     * #swagger.summary = Logout
     * #swagger.description = Logout with token or without token
     *
     */
let data ;
    if (req.token) {
     data = await Token.deleteOne({ token: req.token });
    }
    req.user = null;
    req.token = null;

    res.json({
      error: false,
      message: "Logout is OK!",
      data
    });
  },
};
