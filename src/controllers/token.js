"use strict"
/* -------------------------------------------------------
    | FULLSTACK TEAM | NODEJS / EXPRESS |
------------------------------------------------------- */





"use strict";

const {Token} = require('../models/token');
const { User } = require('../models/user');

/* -------------------------------------------------------
    | FULLSTACK TEAM | NODEJS / EXPRESS |
------------------------------------------------------- */

module.exports.token = {
  list: async (req, res) => {
    /**
         * #swagger.tags = ['Tokens']
         * #swagger.summary = List the tokens
         * #swagger.description = `List the all tokens
         * You can send query with endpoint for search[], sort[], page and limit.
            <ul> Examples:
                <li>URL/?<b>filter[field1]=value1&filter[field2]=value2</b></li>
                <li>URL/?<b>search[field1]=value1&search[field2]=value2</b></li>
                <li>URL/?<b>sort[field1]=1&sort[field2]=-1</b></li>
                <li>URL/?<b>page=2&limit=1</b></li>
            </ul>`

         */
    const tokens = await res.getModelList(Token,{},"userId");
 
    res.json({
      error: false,
      message: "Tokens are listed!",
      details: await res.getModelListDetails(Token),
      result: tokens,
    });
  },
  create: async (req, res) => {
    /**
         * #swagger.tags = ['Tokens']
         * #swagger.summary = Create new Token
         * #swagger.description = `Create a new Token`
         * #swagger.parameters['body'] = {
                in:'body',
                required:true,
                schema: {
                  $ref: '#/definitions/Token'
                }
             }

         */
    const { userId, token } = req.body;
    if (!userId || !token ) {
      res.errorStatusCode = 400;
      throw new Error(
        "Bad request - userId, token fields are required!"
      );
    }

    const userAvaliable = await User.findOne({_id:userId});
    if(!userAvaliable){
      res.errorStatusCode = 404;
      throw new Error('UserId not found on User collection!')
    }


    const newToken = await Token.create({userId, token});

    res.status(201).json({
      error: false,
      message: "A new token is created!",
      result: newToken,
    });
  },
  read: async (req, res) => {
    /**
     * #swagger.tags = ['Tokens']
     * #swagger.summary = Get one Token
     * #swagger.description = `Get one Token`
     */
    const tokenData = await Token.findOne({ _id: req.params.id });
    if (!tokenData) {
      res.errorStatusCode = 404;
      throw new Error("Token not found!");
    }

    res.json({
      error: false,
      message: "Token is here!",
      result: tokenData,
    });
  },
  update: async (req, res) => {
    /**
         * #swagger.tags = ['Tokens']
         * #swagger.summary = Update new Token
         * #swagger.description = `Update a new Token`
         * #swagger.parameters['body'] = {
                in:'body',
                required:true,
                schema: {
                  $ref: '#/definitions/Token'
                }
             }

         */
    const { userId, token } = req.body;
    if (!userId || !token) {
      res.errorStatusCode = 400;
      throw new Error(
        "Bad request - userId, token fields are required!"
      );
    }

    const userAvaliable = await User.findOne({_id:userId});
    if(!userAvaliable){
      res.errorStatusCode = 404;
      throw new Error('UserId not found on User collection!')
    }


    const tokenData = await Token.findOne({ _id: req.params.id });
    if (!tokenData) {
      res.errorStatusCode = 404;
      throw new Error("Token not found!");
    }

    const { modifiedCount } = await Token.updateOne(
      { _id: req.params.id },
      {userId,token},
      { runValidators: true }
    );
    if (modifiedCount < 1) {
      res.errorStatusCode = 500;
      throw new Error("Something went wrong - issue at the end!");
    }
    res.status(202).json({
      error: false,
      message: "Token is updated!",
      result: await Token.findOne({ _id: req.params.id }),
    });
  },
  delete: async (req, res) => {
    /**
     * #swagger.tags = ['Tokens']
     * #swagger.summary = Delete one Token
     * #swagger.description = `Delete one Token`
     */
    const tokenData = await Token.findOne({ _id: req.params.id });
    if (!tokenData) {
      res.errorStatusCode = 404;
      throw new Error("Token not found!");
    }
    const { deletedCount } = await Token.deleteOne(
        { _id: req.params.id }
      );
      if (deletedCount < 1) {
        res.errorStatusCode = 500;
        throw new Error("Something went wrong - issue at the end!");
      }

    res.sendStatus(204);
  },
};
