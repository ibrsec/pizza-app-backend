"use strict";

/* -------------------------------------------------------
| FULLSTACK TEAM | NODEJS / EXPRESS |
------------------------------------------------------- */

const { Token } = require("../models/token");
const { User } = require("../models/user");
const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  req.user = null;
  req.token = null;

  const authHeader = req.headers.authorization || null;

  if (authHeader && authHeader.startsWith("Token ")) {
    const tokenKey = authHeader.split(" ")[1];
    if (tokenKey) {
      const tokenData = await Token.findOne({ token: tokenKey }).populate(
        "userId"
      );
      if (tokenData) {
        req.user = tokenData?.userId;
        req.token = tokenData?.token;
      }
    }
  } else if (authHeader && authHeader.startsWith("Bearer ")) {
    const tokenKey = authHeader.split(" ")[1];
    if (tokenKey) {
      let userId = null;
      let username = null;
      jwt.verify(
        tokenKey,
        process.env.ACCESSTOKEN_SECRETKEY,
        (err, decoded) => {
          if (!err) {
            console.log("decoded=", decoded);
            userId = decoded?.userId;
            username = decoded?.username;
          } else {
            console.log("jwt veryify err = ", err);
          }
        }
      );
      const user = await User.findOne({ _id: userId,username });
        if(user){
          req.user = user;
          req.token = tokenKey;
        }




    }
  }

  next();
};
