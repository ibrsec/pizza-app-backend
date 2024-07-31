"use strict"


/* -------------------------------------------------------
| FULLSTACK TEAM | NODEJS / EXPRESS |
------------------------------------------------------- */
const router = require('express').Router()
const { pizza } = require('../controllers/pizza');
const checkId = require('../middlewares/checkId');
/* ------------------------------------------------------- */

router.route("/").get(pizza.list).post(pizza.create);
router
  .route("/:id")
  .get(checkId,pizza.read)
  .put(checkId,pizza.update)
  .delete(checkId,pizza.delete);
/* ------------------------------------------------------- */
module.exports = router