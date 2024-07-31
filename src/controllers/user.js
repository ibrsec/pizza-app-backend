"use strict";

const { User } = require("../models/user");

/* -------------------------------------------------------
    | FULLSTACK TEAM | NODEJS / EXPRESS |
------------------------------------------------------- */

module.exports.user = {
  list: async (req, res) => {
    /**
         * #swagger.tags = ['Users']
         * #swagger.summary = List the users
         * #swagger.description = `List the all users
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
    const users = await res.getModelList(User);

    res.json({
      error: false,
      message: "Users are listed!",
      details: await res.getModelListDetails(User),
      result: users,
    });
  },
  create: async (req, res) => {
    /**
         * #swagger.tags = ['Users']
         * #swagger.summary = Create new User
         * #swagger.description = `Create a new User
                                  </br></br>
                                  Permission : <b>No permission</b>`
         * #swagger.parameters['body'] = {
                in:'body',
                required:true,
                schema: {
                  $ref: '#/definitions/User'
                }
             }

         */
    const { username, email, password, isActive, isAdmin } = req.body;
    if (!username || !email || !password) {
      res.errorStatusCode = 400;
      throw new Error(
        "Bad request - username, email, password fields are required!"
      );
    }
    const newUser = await User.create({
      username,
      email,
      password,
      isActive,
      isAdmin,
    });

    res.status(201).json({
      error: false,
      message: "A new user is created!",
      result: newUser,
    });
  },
  createAdminUser: async (req, res) => {
    /**
         * #swagger.tags = ['Users']
         * #swagger.summary = Create new Admin User
         * #swagger.description = `Create a Admin User
                                  </br></br>
                                  Permission : <b>No permission</b>
                                  
                                  </br></br>
                                  extra field required for creating the admin user:</br> <b>adminkey: "i_am_admin"</b>
                                  `
         * #swagger.parameters['body'] = {
                in:'body',
                required:true,
                schema: {
                  $username: 'test',
                  $email: 'test@test.com',
                  $password: 'TestTest1?',
                  $adminkey: 'i_am_admin'
            }
             }

         */
    const { username, email, password, isActive, adminkey } = req.body;
    if (!username || !email || !password || !adminkey) {
      res.errorStatusCode = 400;
      throw new Error(
        "Bad request - username, email, password, adminkey fields are required!"
      );
    }

    if(adminkey !== 'i_am_admin'){
      res.errorStatusCode = 401;
      throw new Error('Unauthorized - Admin user  creation is limited to who provides the correct adminkey !')
    }

    const newUser = await User.create({
      username,
      email,
      password,
      isActive,
      isAdmin : true,
    });

    res.status(201).json({
      error: false,
      message: "A new user is created!",
      result: newUser,
    });
  },
  read: async (req, res) => {
    /**
     * #swagger.tags = ['Users']
     * #swagger.summary = Get one User
     * #swagger.description = `Get one User
                              </br></br>
                              Permission : <b>Normal User</b>`
     */
    const userData = await User.findOne({ _id: req.params.id });
    if (!userData) {
      res.errorStatusCode = 404;
      throw new Error("User not found!");
    }

    res.json({
      error: false,
      message: "User is here!",
      result: userData,
    });
  },
  update: async (req, res) => {
    /**
         * #swagger.tags = ['Users']
         * #swagger.summary = Update new User
         * #swagger.description = `Update a new User
                              </br></br>
                              Permission : <b>Admin User</b>`
         * #swagger.parameters['body'] = {
                in:'body',
                required:true,
                schema: {
                  $ref: '#/definitions/User'
                }
             }

         */
    const { username, email, password,isActive, isAdmin } = req.body;
    if (!username || !email || !password) {
      res.errorStatusCode = 400;
      throw new Error(
        "Bad request - username, email, password fields are required!"
      );
    }

    const userData = await User.findOne({ _id: req.params.id });
    if (!userData) {
      res.errorStatusCode = 404;
      throw new Error("User not found!");
    }

    const { modifiedCount } = await User.updateOne(
      { _id: req.params.id },
      { username, email, password,isActive, isAdmin},
      { runValidators: true }
    );
    if (modifiedCount < 1) {
      res.errorStatusCode = 500;
      throw new Error("Something went wrong - issue at the end!");
    }
    res.status(202).json({
      error: false,
      message: "User is updated!",
      result: await User.findOne({ _id: req.params.id }),
    });
  },
  delete: async (req, res) => {
    /**
     * #swagger.tags = ['Users']
     * #swagger.summary = Delete one User
     * #swagger.description = `Delete one User
                              </br></br>
                              Permission : <b>Admin User</b>`
     */
    const user = await User.findOne({ _id: req.params.id });
    if (!user) {
      res.errorStatusCode = 404;
      throw new Error("User not found!");
    }
    const { deletedCount } = await User.deleteOne({ _id: req.params.id });
    if (deletedCount < 1) {
      res.errorStatusCode = 500;
      throw new Error("Something went wrong - issue at the end!");
    }

    res.sendStatus(204);
  },
};
