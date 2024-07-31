"use strict"
/* -------------------------------------------------------
    | FULLSTACK TEAM | NODEJS / EXPRESS |
------------------------------------------------------- */
const express = require('express')
const router = express.Router()
const path = require('path');
/* ------------------------------------------------------- */
// routes/document:

// URL: /documents

router.all('/', (req, res) => {
    res.send({
        swagger: "/documents/swagger",
        redoc: "/documents/redoc",
        json: "/documents/json",
    })
})

// JSON:
router.use('/json', (req, res) => {
    res.sendFile(`/src/configs/swagger.json`, { root: '.' })
})

// Redoc:
const redoc = require('redoc-express')
router.use('/redoc', redoc({ specUrl: '/documents/json', title: 'API Docs' }))

// Swagger:
const swaggerUi = require('swagger-ui-express')
router.use('/swagger', swaggerUi.serve, swaggerUi.setup(require('../configs/swagger.json'), { swaggerOptions: { persistAuthorization: true } }))

router.use('/swagger', express.static(path.join(__dirname,'node_modules','swagger-ui-dist')));
// router.use('/swagger', express.static(path.join(__dirname, 'node_modules', 'swagger-ui-dist')));

/* ------------------------------------------------------- */
module.exports = router