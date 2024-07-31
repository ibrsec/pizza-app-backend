"use strict"
/* -------------------------------------------------------
    | FULLSTACK TEAM | NODEJS / EXPRESS |
------------------------------------------------------- */
const { mongoose } = require('../configs/dbConnection')
/* ------------------------------------------------------- */

const pizzaSizes = {
    SMALL:'Small',
    MEDIUM:'Medium',
    LARGE:'Large',
    XLARGE:'Xlarge',
}


const OrderSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    pizzaId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Pizza',
        required:true,
    },
    size:{
        type:String,
        trim:true,
        required:true,
        enum: Object.values(pizzaSizes),

    },
    quantity:{
        type:Number,
        default:1,
    },
    price : {
        type:Number,
        required:true,
    },
    amount:{
        type:Number,
        required:true,
        default:function(){ //create
            return this.price * this.quantity;
        },
        transform:function(){ //update
            return this.price * this.quantity;
        },
    }
},{
    collection:'orders',timestamps:true
})

module.exports.Order = mongoose.model('Order',OrderSchema)