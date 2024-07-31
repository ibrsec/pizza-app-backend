"use strict";
const { mongoose } = require("../configs/dbConnection");
/* -------------------------------------------------------
    | FULLSTACK TEAM | NODEJS / EXPRESS |
------------------------------------------------------- */

const { Order } = require("../models/order");
const { Pizza } = require("../models/pizza");
const { User } = require("../models/user");

module.exports.order = {
  list: async (req, res) => {
    /**
         * #swagger.tags = ['Orders']
         * #swagger.summary = List the orders
         * #swagger.description = `List the all orders 
         * You can send query with endpoint for search[], sort[], page and limit.
            <ul> Examples:
                <li>URL/?<b>filter[field1]=value1&filter[field2]=value2</b></li>
                <li>URL/?<b>search[field1]=value1&search[field2]=value2</b></li>
                <li>URL/?<b>sort[field1]=1&sort[field2]=-1</b></li>
                <li>URL/?<b>page=2&limit=1</b></li>
            </ul>
            </br></br>
            Permission : <b>Normal User</b>`

         */
    const orders = await res.getModelList(Order, {}, ["pizzaId", "userId"]);

    res.json({
      error: false,
      message: "Orders are listed!",
      details: await res.getModelListDetails(Order),
      result: orders,
    });
  },
  create: async (req, res) => {
    /**
         * #swagger.tags = ['Orders']
         * #swagger.summary = Create new Order
         * #swagger.description = `Create a new Order</br>
         *                         Price comes from pizzas collection</br>Valid pizza sizes : 'Small', 'Medium', 'Large', 'Xlarge'</br>
                                  </br></br>
                                  Permission : <b>Normal User</b>` 
         * #swagger.parameters['body'] = {
                in:'body',
                required:true,
                schema: {
                  $ref: '#/definitions/Order'
                }
             }

         */
    const { userId, pizzaId, size, quantity } = req.body;
    if (!userId || !pizzaId || !size ) {
      res.errorStatusCode = 400;
      throw new Error(
        "Bad request - userId, pizzaId, size fields are required!"
      );
    }

    if(!mongoose.Types.ObjectId.isValid(userId)){
        res.errorStatusCode = 400;
        throw new Error('Invalid id type! - userId type should be objectId type.')
      }
    if(!mongoose.Types.ObjectId.isValid(pizzaId)){
        res.errorStatusCode = 400;
        throw new Error('Invalid id type! - pizzaId type should be objectId type.')
      }
    const user = await User.findOne({ _id: userId });
    if (!user) {
      res.errorStatusCode = 404;
      throw new Error(
        "Not Found - userId not found on Users!: userId:" + userId
      );
    }
    const pizza = await Pizza.findOne({ _id: pizzaId });
    if (!pizza) {
      res.errorStatusCode = 404;
      throw new Error(
        "Not Found - pizzaId not found on Users!: pizzaId:" + pizzaId
      );
    }
     
    const newOrder = await Order.create({ userId, pizzaId, size, quantity, price: pizza?.price});

    res.status(201).json({
      error: false,
      message: "A new order is created!",
      result: newOrder,
    });
  },
  read: async (req, res) => {
    /**
     * #swagger.tags = ['Orders']
     * #swagger.summary = Get one Order
     * #swagger.description = `Get one Order
                                </br></br>
                                Permission : <b>Normal User</b>`
     */
    const orderData = await Order.findOne({ _id: req.params.id });
    if (!orderData) {
      res.errorStatusCode = 404;
      throw new Error("Order not found!");
    }

    res.json({
      error: false,
      message: "Order is here!",
      result: orderData,
    });
  },
  update: async (req, res) => {
    /**
         * #swagger.tags = ['Orders']
         * #swagger.summary = Update new Order
         * #swagger.description = `Update a new Order
                                </br></br>
                                Permission : <b>Admin User</b>`
         * #swagger.parameters['body'] = {
                in:'body',
                required:true,
                schema: {
                  $ref: '#/definitions/Order'
                }
             }

         */
    const { userId, pizzaId, size, quantity } = req.body;
    if (!userId || !pizzaId || !size ) {
      res.errorStatusCode = 400;
      throw new Error(
        "Bad request - userId, pizzaId, size fields are required!"
      );
    }

    //check the type of the ids
    if(!mongoose.Types.ObjectId.isValid(userId)){
        res.errorStatusCode = 400;
        throw new Error('Invalid id type! - userId type should be objectId type.')
      }
    if(!mongoose.Types.ObjectId.isValid(pizzaId)){
        res.errorStatusCode = 400;
        throw new Error('Invalid id type! - pizzaId type should be objectId type.')
      }


    //check if the user id is exist on users
    const user = await User.findOne({ _id: userId });
    if (!user) {
        res.errorStatusCode = 404;
        throw new Error(
            "Not Found - userId not found on Users!: userId:" + userId
            );
        }

        //check if the pizza id is exist on pizzas
        const pizza = await Pizza.findOne({ _id: pizzaId });
        if (!pizza) {
      res.errorStatusCode = 404;
      throw new Error(
        "Not Found - pizzaId not found on Users!: pizzaId:" + pizzaId
      );
    }

    const orderData = await Order.findOne({ _id: req.params.id });
    if (!orderData) {
      res.errorStatusCode = 404;
      throw new Error("Order not found!");
    }

    const { modifiedCount } = await Order.updateOne(
      { _id: req.params.id },
      { userId, pizzaId, size, quantity, price: pizza?.price },
      { runValidators: true }
    );
    if (modifiedCount < 1) {
      res.errorStatusCode = 500;
      throw new Error("Something went wrong - issue at the end!");
    }
    res.status(202).json({
      error: false,
      message: "Order is updated!",
      result: await Order.findOne({ _id: req.params.id }),
    });
  },
  delete: async (req, res) => {
    /**
     * #swagger.tags = ['Orders']
     * #swagger.summary = Delete one Order
     * #swagger.description = `Delete one Order
                                </br></br>
                                Permission : <b>Admin User</b>`
     */
    const orderData = await Order.findOne({ _id: req.params.id });
    if (!orderData) {
      res.errorStatusCode = 404;
      throw new Error("Order not found!");
    }
    const { deletedCount } = await Order.deleteOne({ _id: req.params.id });
    if (deletedCount < 1) {
      res.errorStatusCode = 500;
      throw new Error("Something went wrong - issue at the end!");
    }

    res.sendStatus(204);
  },
};
