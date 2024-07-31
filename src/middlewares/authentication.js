"use strict";

/* -------------------------------------------------------
| FULLSTACK TEAM | NODEJS / EXPRESS |
------------------------------------------------------- */

const { Token } = require("../models/token");

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
  }

  next();
};
