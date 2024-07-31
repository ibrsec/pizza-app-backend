"use strict"

const { order } = require('../controllers/order');
const checkId = require('../middlewares/checkId');

/* -------------------------------------------------------
    | FULLSTACK TEAM | NODEJS / EXPRESS |
------------------------------------------------------- */
const router = require('express').Router()
/* ------------------------------------------------------- */
router.route("/").get(order.list).post(order.create);
router
  .route("/:id")
  .get(checkId,order.read)
  .put(checkId,order.update)
  .delete(checkId,order.delete);
/* ------------------------------------------------------- */
module.exports = router