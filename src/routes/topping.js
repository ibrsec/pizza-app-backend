"use strict";


/* -------------------------------------------------------
| FULLSTACK TEAM | NODEJS / EXPRESS |
------------------------------------------------------- */
const router = require("express").Router();
const { topping } = require("../controllers/topping");
const checkId = require("../middlewares/checkId");
/* ------------------------------------------------------- */

router.route("/").get(topping.list).post(topping.create);
router
  .route("/:id")
  .get(checkId,topping.read)
  .put(checkId,topping.update)
  .delete(checkId,topping.delete);
/* ------------------------------------------------------- */
module.exports = router;
