"use strict"
/* -------------------------------------------------------
    | FULLSTACK TEAM | NODEJS / EXPRESS |
------------------------------------------------------- */

 

const {Topping} = require('../models/topping'); 

/* -------------------------------------------------------
    | FULLSTACK TEAM | NODEJS / EXPRESS |
------------------------------------------------------- */

module.exports.topping = {
  list: async (req, res) => {
    /**
         * #swagger.tags = ['Toppings']
         * #swagger.summary = List the toppings
         * #swagger.description = `List the all toppings
         * You can send query with endpoint for search[], sort[], page and limit.
            <ul> Examples:
                <li>URL/?<b>filter[field1]=value1&filter[field2]=value2</b></li>
                <li>URL/?<b>search[field1]=value1&search[field2]=value2</b></li>
                <li>URL/?<b>sort[field1]=1&sort[field2]=-1</b></li>
                <li>URL/?<b>page=2&limit=1</b></li>
            </ul>
            </br></br>
            Permission : <b>Normal User</b>
            `
            

         */
    const toppings = await res.getModelList(Topping); 
 
    res.json({
      error: false,
      message: "Toppings are listed!",
      details: await res.getModelListDetails(Topping),
      result: toppings,
    });
  },
  create: async (req, res) => {
    /**
         * #swagger.tags = ['Toppings']
         * #swagger.summary = Create new Topping
         * #swagger.description = `Create a new Topping
            </br></br>
            Permission : <b>Normal User</b>`
         * #swagger.parameters['body'] = {
                in:'body',
                required:true,
                schema: {
                  $ref: '#/definitions/Topping'
                }
             }

         */
    const { name } = req.body;
    if (!name ) {
      res.errorStatusCode = 400;
      throw new Error(
        "Bad request - name field is required!"
      );
    }
 

    const newTopping = await Topping.create({name});

    res.status(201).json({
      error: false,
      message: "A new topping is created!",
      result: newTopping,
    });
  },
  read: async (req, res) => {
    /**
     * #swagger.tags = ['Toppings']
     * #swagger.summary = Get one Topping
     * #swagger.description = `Get one Topping
            </br></br>
            Permission : <b>Normal User</b>`
     */
    const toppingData = await Topping.findOne({ _id: req.params.id });
    if (!toppingData) {
      res.errorStatusCode = 404;
      throw new Error("Topping not found!");
    }

    res.json({
      error: false,
      message: "Topping is here!",
      result: toppingData,
    });
  },
  update: async (req, res) => {
    /**
         * #swagger.tags = ['Toppings']
         * #swagger.summary = Update new Topping
         * #swagger.description = `Update a new Topping
            </br></br>
            Permission : <b>Admin User</b>`
         * #swagger.parameters['body'] = {
                in:'body',
                required:true,
                schema: {
                  $ref: '#/definitions/Topping'
                }
             }

         */
    const { name } = req.body;
    if (!name) {
      res.errorStatusCode = 400;
      throw new Error(
        "Bad request - name filed is required!"
      );
    }
 

    
    const toppingData = await Topping.findOne({ _id: req.params.id });
    if (!toppingData) {
      res.errorStatusCode = 404;
      throw new Error("Topping not found!");
    }

    const { modifiedCount } = await Topping.updateOne(
      { _id: req.params.id },
      {name},
      { runValidators: true }
    );
    if (modifiedCount < 1) {
      res.errorStatusCode = 500;
      throw new Error("Something went wrong - issue at the end!");
    }
    res.status(202).json({
      error: false,
      message: "Topping is updated!",
      result: await Topping.findOne({ _id: req.params.id }),
    });
  },
  delete: async (req, res) => {
    /**
     * #swagger.tags = ['Toppings']
     * #swagger.summary = Delete one Topping
     * #swagger.description = `Delete one Topping
            </br></br>
            Permission : <b>Admin User</b>`
     */
    const toppingData = await Topping.findOne({ _id: req.params.id });
    if (!toppingData) {
      res.errorStatusCode = 404;
      throw new Error("Topping not found!");
    }
    const { deletedCount } = await Topping.deleteOne(
        { _id: req.params.id }
      );
      if (deletedCount < 1) {
        res.errorStatusCode = 500;
        throw new Error("Something went wrong - issue at the end!");
      }

    res.sendStatus(204);
  },
};
