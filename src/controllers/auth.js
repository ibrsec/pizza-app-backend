"use strict";

const { passwordEncryptor } = require("../helpers/passwordEncrypt");
const { User } = require("../models/user");
const { Token } = require("../models/token");
const jwt = require("jsonwebtoken");

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

    const accessData = {
      userId: user?._id,
      username: user?.username,
      isAdmin: user?.isAdmin,
      isActive: user?.isActive,
    };

    const accessToken = jwt.sign(
      accessData,
      process.env.ACCESSTOKEN_SECRETKEY,
      { expiresIn: "30m" }
    );

    const refreshData = {
      username: user?.username,
      password: user?.password,
    };
    const refreshToken = jwt.sign(
      refreshData,
      process.env.REFRESHTOKEN_SECRETKEY,
      { expiresIn: "1d" }
    );

    res.json({
      error: false,
      message: "Login is OK!",
      result: {
        userId: tokenData.userId,
        token: tokenData?.token,
        bearer: {
          accessToken,
          refreshToken,
        },
      },
    });
  },
  refresh: async (req, res) => {
    /**
     * #swagger.tags = ['Authentication'],
     * #swagger.summary = Refresh
     * #swagger.description = Refresh the access token with refresh token which comes from login post.
     */
    const {bearer} = req.body;
    const {refreshToken} = bearer;
    if (!refreshToken) {
      res.errorStatusCode = 400;
      throw new Error("Please enter the refresh token!");
    }

    const decodedRefreshData = await jwt.verify(
      refreshToken,
      process.env.REFRESHTOKEN_SECRETKEY
    );
    console.log(decodedRefreshData);

    const user = await User.findOne({ username: decodedRefreshData?.username });
    if (!user) {
      res.errorStatusCode = 401;
      throw new Error("Unauthorized - user not found!");
    }

    if(user?.password !== decodedRefreshData.password){
      res.errorStatusCode = 401;
      throw new Error("Unauthorized - Invalid password!");

    }
    const accessData = {
      userId: user?._id,
      username: user?.username,
      isAdmin: user?.isAdmin,
      isActive: user?.isActive,
    };
    const accessToken =  jwt.sign(
      accessData,
      process.env.ACCESSTOKEN_SECRETKEY,
      {
        expiresIn:"30m"
      }
    )
    res.json({
      error:false,
      message:"refresh is OK!",
      bearer:{
        accessToken
      }
    })

  },
  logout: async (req, res) => {
    /**
     * #swagger.tags = ['Authentication'],
     * #swagger.summary = Logout
     * #swagger.description = Logout with token or without token
     *
     */
    let data;
    if (req.token) {
      data = await Token.deleteOne({ token: req.token });
    }
    req.user = null;
    req.token = null;

    res.json({
      error: false,
      message: "Logout is OK!",
      data,
    });
  },
};
