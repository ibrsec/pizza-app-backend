"use strict";

/* -------------------------------------------------------
| FULLSTACK TEAM | NODEJS / EXPRESS |
------------------------------------------------------- */
const router = require("express").Router();
const { pizza } = require("../controllers/pizza");
const checkId = require("../middlewares/checkId");
const { permissions } = require("../middlewares/permissions");
/* ------------------------------------------------------- */

router
  .route("/")
  .get(permissions.isLogin, pizza.list)
  .post(permissions.isLogin, pizza.create);
router
  .route("/:id")
  .get(permissions.isLogin, checkId, pizza.read)
  .put(permissions.isAdmin, checkId, pizza.update)
  .delete(permissions.isAdmin, checkId, pizza.delete);
/* ------------------------------------------------------- */
module.exports = router;
