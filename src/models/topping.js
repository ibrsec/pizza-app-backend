"use strict";
/* -------------------------------------------------------
    | FULLSTACK TEAM | NODEJS / EXPRESS |
------------------------------------------------------- */
const { mongoose } = require("../configs/dbConnection");
/* ------------------------------------------------------- */

const ToppingSchema = new mongoose.Schema(
  {
    name:{
        type:String,
        trim:true,
        unique:true,
        required:true
    }
  },
  {
    collection: "toppings",
    timestamps: true,
  }
);

module.exports.Topping = mongoose.model("Topping", ToppingSchema);
