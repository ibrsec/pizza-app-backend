"use strict"
/* -------------------------------------------------------
	EXPRESS - Personnel API
------------------------------------------------------- */
require('dotenv').config()
const HOST = process.env?.HOST ;
const PORT = process.env?.PORT ;
/* ------------------------------------------------------- */
const swaggerAutogen = require('swagger-autogen')()
const packageJson = require('./package.json')

const document = {
	info: {
		version: packageJson.version,
		title: packageJson.title,
		description: packageJson.description,
		termsOfService: "http://www.CourseName.com/#",
		contact: { name: packageJson.author, email: "ibr.seckin@gmail.com" },
		license: { name: packageJson.license, },
	},
	host: `${HOST}`,
	basePath: '/',
	schemes: [ 'https'],
	consumes: ["application/json"],
	produces: ["application/json"],
	securityDefinitions: {
		Token: {
			type: 'apiKey',
			in: 'header',
			name: 'Authorization',
			description: 'Simple Token Authentication * Example: <b>Token ...tokenKey...</b>'
		},
		Bearer: {
			type: 'apiKey',
			in: 'header',
			name: 'Authorization',
			description: 'JWT Authentication * Example: <b>Bearer ...accessToken...</b>'
		},
	},
	security: [{ Token: [] }, { Bearer: [] }],
	definitions: {
		// Models:
		"Token": require('./src/models/token').Token.schema.obj,
		"User": require('./src/models/user').User.schema.obj,
		"Topping": require('./src/models/topping').Topping.schema.obj,
		"Pizza": require('./src/models/pizza').Pizza.schema.obj,
		"Order": require('./src/models/order').Order.schema.obj,
	}
}

const routes = ['./index.js']
const outputFile = './src/configs/swagger.json'

// Create JSON file:
swaggerAutogen(outputFile, routes, document)