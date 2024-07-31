"use strict"
/* -------------------------------------------------------
    | FULLSTACK TEAM | NODEJS / EXPRESS |
------------------------------------------------------- */
const { mongoose } = require('../configs/dbConnection')
const {passwordEncryptor} = require('../helpers/passwordEncrypt');
/* ------------------------------------------------------- */
const invalidPassword = 'Invalid password type!';


const UserSchema = new mongoose.Schema(
    {
      username: {
        type: String, 
        trim:true,
        required: true,
        unique:true,
      },
      password: {
        type: String, 
        trim:true,
        required: true, 
        set:(password)=> {
            if(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,16}$/.test(password)){
                return passwordEncryptor(password)
            }else{
                return invalidPassword
            }
        
        },validate:[(password)=> {
            if(password === invalidPassword){
                return false;
            }else{
                return true;
            }
        },invalidPassword+" - type => length: 8 to 16 | contain: 1 upper,lower,number,sepacial[@$!%*?&]"]
      },email:{
        type:String,
        trim:true,
        required:true,
        unique:true,
        validate:[(email)=> {
            if(/.+@.+\..+/.test(email)){
                return true;
            }else{
                return false;
            }
        },'Please fill a valid email address __@__.__']
      },
      isActive:{
        type:Boolean,
        default:true
      },
      isAdmin:{
        type:Boolean,
        default:false
      },
    },
    {
      collection: "users",
      timestamps: true,
    }
  );
  
  module.exports.User = mongoose.model("User", UserSchema);
  