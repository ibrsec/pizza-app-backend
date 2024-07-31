"use strict";

const { mongoose } = require("../configs/dbConnection")

module.exports  = (req,res,next) => {
    if(!mongoose.Types.ObjectId.isValid(req.params.id)){
        res.errorStatusCode = 400;
        throw new Error('Invalid id type! - id type should be objectId type.')
    }
    next();
}