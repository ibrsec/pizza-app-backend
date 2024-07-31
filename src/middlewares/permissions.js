"use strict"
/* -------------------------------------------------------
    | FULLSTACK TEAM | NODEJS / EXPRESS |
------------------------------------------------------- */


module.exports.permissions = {
    isLogin : (req,res,next)=> {
        if(req.user && req.user.isActive){
            next();
        }else{
            res.errorStatusCode = 403;
            throw new Error('No permission - you must login first!')
        }
    },
    isAdmin: (req,res,next) => {
        if(req.user && req.user.isActive && req.user.isAdmin){
            next();
        }else{
            res.errorStatusCode = 403;
            throw new Error('No permission - you must login and be admin!')
        }

    }
}






