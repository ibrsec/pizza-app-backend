"use strict";


/* -------------------------------------------------------
| FULLSTACK TEAM | NODEJS / EXPRESS |
------------------------------------------------------- */
const router = require("express").Router();
const { topping } = require("../controllers/topping");
const checkId = require("../middlewares/checkId");
const {permissions} = require('../middlewares/permissions')
/* ------------------------------------------------------- */

router.route("/").get(permissions.isLogin,topping.list).post(permissions.isLogin, topping.create);
router
  .route("/:id")
  .get(permissions.isLogin, checkId,topping.read)
  .put(permissions.isAdmin, checkId,topping.update)
  .delete(permissions.isAdmin, checkId,topping.delete);
/* ------------------------------------------------------- */
module.exports = router;
