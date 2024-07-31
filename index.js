"use strict"
/* -------------------------------------------------------
    | FULLSTACK TEAM | NODEJS / EXPRESS |
------------------------------------------------------- */
/*
    $ cp .env-sample .env
    $ npm init -y
    $ npm i express dotenv mongoose express-async-errors
    $ npm i morgan swagger-autogen swagger-ui-express redoc-express
    $ mkdir logs
    $ nodemon
*/
const express = require('express')
const app = express()

/* ------------------------------------------------------- */
// Required Modules:

// envVariables to process.env:
require('dotenv').config()
const PORT = process.env?.PORT ;

// asyncErrors to errorHandler:
require('express-async-errors')

/* ------------------------------------------------------- */
// Configrations: 

// Connect to DB:
const { dbConnection } = require('./src/configs/dbConnection')
dbConnection()

/* ------------------------------------------------------- */
// Middlewares:

// Accept JSON:
app.use(express.json())

// Logger:
app.use(require('./src/middlewares/logger'))

// Auhentication:
// app.use(require('./src/middlewares/authentication'))

// findSearchSortPage / res.getModelList:
app.use(require('./src/middlewares/queryHandler'))

//cors 
const cors =  require('cors');
app.use(cors({
    origin:"http://localhost:8000"
}))



/* ------------------------------------------------------- */
// Routes:

// routes/index.js:
app.use('/', require('./src/routes/'))

// HomePath:
app.all('/', (req, res) => {
    res.send({
        error: false,
        message: 'Welcome to PIZZA API',
        docs: {
            swagger: "/documents/swagger",
            redoc: "/documents/redoc",
            json: "/documents/json",
        },
        user: req.user,
    })
})

/* ------------------------------------------------------- */

// errorHandler:
app.use(require('./src/middlewares/errorHandler'))

// RUN SERVER:
app.listen(PORT, () => console.log('http://127.0.0.1:' + PORT))

/* ------------------------------------------------------- */
// Syncronization (must be in commentLine):
// require('./src/helpers/sync')() // !!! It clear database.






/**
 * index js=>
 *  use strict
 *  imports
 *      - dotenv
 *  express,app
 *  dbconnection
 *  middlewares
 *      - json parser
 *      authentocation
 *      session cookies
 *      query handler
 *      swagger
 *  routes
 *  errorhandler
 *  PORT and listen
 * ----------------------------
 * errorhandler + index js
 * db connection + indexjs
 * department model
 * personnel model
 * passwordEncryptor
 * department  route index js
 * express-async-errors index js
 * queryhandler indexjs
 * personnel controller routes index js
 * autogen at root
 * swagger json
 * swagger ui
 * redoc
 * logger morgan middle ware -> index js
 * token model routes index js
 * auth controller routes index js
 *  - login
 *  - current
 *  - logout
 * authenticatio mw
 * permissions
 *  isLogin
 *  isAdmin
 *  isLeadOrAdmin
 * all permissions are fixed and tested
 * cors
 * swagger path
 * permission to swager controller descriptions
 * 
 * 
 * 
 * 
 * page size = session cooikies ile ekle
 */
