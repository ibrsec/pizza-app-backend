"use strict";
/* -------------------------------------------------------
    | FULLSTACK TEAM | NODEJS / EXPRESS |
------------------------------------------------------- */
const { mongoose } = require("../configs/dbConnection");
/* ------------------------------------------------------- */

const TokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true,
      index: true,
      ref: "User",
    },
    token: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      index: true,
    },
  },
  {
    collection: "tokens",
    timestamps: true,
  }
);

if (mongoose.model["Token"]) {
  module.exports.Token = mongoose.model["Token"];
} else {
  module.exports.Token = mongoose.model("Token", TokenSchema); 
  }
