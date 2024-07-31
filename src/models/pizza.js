"use strict";
/* -------------------------------------------------------
    | FULLSTACK TEAM | NODEJS / EXPRESS |
------------------------------------------------------- */
const { mongoose } = require("../configs/dbConnection");
/* ------------------------------------------------------- */

const PizzaSchema = new mongoose.Schema(
  {
    toppingId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Topping",
      },
    ],
    name:{
        type:String,
        trim:true,
        required:true,
        unique:true,

    },
    image:{
        type:String,
        trim:true,

    },
    price:{
        type:Number,
        required:true,
        
    }
  },
  {
    collection: "pizzas",
    timestamps: true,
  }
);

module.exports.Pizza = mongoose.model("Pizza", PizzaSchema);
