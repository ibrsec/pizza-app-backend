"use strict";
const { mongoose } = require("../configs/dbConnection");
/* -------------------------------------------------------
    | FULLSTACK TEAM | NODEJS / EXPRESS |
------------------------------------------------------- */

const { Pizza } = require("../models/pizza");
const { Topping } = require("../models/topping");

module.exports.pizza = {
  list: async (req, res) => {
    /**
         * #swagger.tags = ['Pizzas']
         * #swagger.summary = List the pizzas
         * #swagger.description = `List the all pizzas
         * You can send query with endpoint for search[], sort[], page and limit.
            <ul> Examples:
                <li>URL/?<b>filter[field1]=value1&filter[field2]=value2</b></li>
                <li>URL/?<b>search[field1]=value1&search[field2]=value2</b></li>
                <li>URL/?<b>sort[field1]=1&sort[field2]=-1</b></li>
                <li>URL/?<b>page=2&limit=1</b></li>
            </ul>`

         */
    const pizzas = await res.getModelList(Pizza, {}, "toppingIds");

    res.json({
      error: false,
      message: "Pizzas are listed!",
      details: await res.getModelListDetails(Pizza),
      result: pizzas,
    });
  },
  create: async (req, res) => {
    /**
         * #swagger.tags = ['Pizzas']
         * #swagger.summary = Create new Pizza
         * #swagger.description = `Create a new Pizza`
         * #swagger.parameters['body'] = {
                in:'body',
                required:true,
                schema: {
                  $ref: '#/definitions/Pizza'
                }
             }

         */
    const { name, image, price, toppingIds } = req.body;
    if (!name || !price) {
      res.errorStatusCode = 400;
      throw new Error("Bad request - name and price fields are required!");
    }

    for (let topping of toppingIds) {
      if(!mongoose.Types.ObjectId.isValid(topping)){
        res.errorStatusCode = 400;
        throw new Error('Invalid id type! - topping id type should be objectId type.')
      }
      const data = await Topping.findOne({ _id: topping });
      if (!data) {
        res.errorStatusCode = 404;
        throw new Error(
          "Not Found - Topping not found on Toppings!: toppingid:" + topping
        );
      }
    }

    const newPizza = await Pizza.create({ name, image, price, toppingIds });

    res.status(201).json({
      error: false,
      message: "A new pizza is created!",
      result: newPizza,
    });
  },
  read: async (req, res) => {
    /**
     * #swagger.tags = ['Pizzas']
     * #swagger.summary = Get one Pizza
     * #swagger.description = `Get one Pizza`
     */
    const pizzaData = await Pizza.findOne({ _id: req.params.id });
    if (!pizzaData) {
      res.errorStatusCode = 404;
      throw new Error("Pizza not found!");
    }

    res.json({
      error: false,
      message: "Pizza is here!",
      result: pizzaData,
    });
  },
  update: async (req, res) => {
    /**
         * #swagger.tags = ['Pizzas']
         * #swagger.summary = Update new Pizza
         * #swagger.description = `Update a new Pizza`
         * #swagger.parameters['body'] = {
                in:'body',
                required:true,
                schema: {
                  $ref: '#/definitions/Pizza'
                }
             }

         */
    const { name, image, price, toppingIds } = req.body;
    if (!name || !price) {
      res.errorStatusCode = 400;
      throw new Error("Bad request - name and price fields are required!");
    }

    for (let topping of toppingIds) {
        if(!mongoose.Types.ObjectId.isValid(topping)){
            res.errorStatusCode = 400;
            throw new Error('Invalid id type! - topping id type should be objectId type.')
          }
      const data = await Topping.findOne({ _id: topping });
      if (!data) {
        res.errorStatusCode = 404;
        throw new Error(
          "Not Found - Topping not found on Toppings!: toppingid:" + topping
        );
      }
    }

    const pizzaData = await Pizza.findOne({ _id: req.params.id });
    if (!pizzaData) {
      res.errorStatusCode = 404;
      throw new Error("Pizza not found!");
    }

    const { modifiedCount } = await Pizza.updateOne(
      { _id: req.params.id },
      { name, image, price, toppingIds },
      { runValidators: true }
    );
    if (modifiedCount < 1) {
      res.errorStatusCode = 500;
      throw new Error("Something went wrong - issue at the end!");
    }
    res.status(202).json({
      error: false,
      message: "Pizza is updated!",
      result: await Pizza.findOne({ _id: req.params.id }),
    });
  },
  delete: async (req, res) => {
    /**
     * #swagger.tags = ['Pizzas']
     * #swagger.summary = Delete one Pizza
     * #swagger.description = `Delete one Pizza`
     */
    const pizzaData = await Pizza.findOne({ _id: req.params.id });
    if (!pizzaData) {
      res.errorStatusCode = 404;
      throw new Error("Pizza not found!");
    }
    const { deletedCount } = await Pizza.deleteOne({ _id: req.params.id });
    if (deletedCount < 1) {
      res.errorStatusCode = 500;
      throw new Error("Something went wrong - issue at the end!");
    }

    res.sendStatus(204);
  },
};
