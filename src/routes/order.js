"use strict";

/* -------------------------------------------------------
| FULLSTACK TEAM | NODEJS / EXPRESS |
------------------------------------------------------- */
const router = require("express").Router();
const { order } = require("../controllers/order");
const checkId = require("../middlewares/checkId");
const { permissions } = require("../middlewares/permissions");
/* ------------------------------------------------------- */
router.route("/").get(permissions.isLogin, order.list).post(permissions.isLogin, order.create);
router
  .route("/:id")
  .get(permissions.isLogin, checkId, order.read)
  .put(permissions.isAdmin, checkId, order.update)
  .delete(permissions.isAdmin, checkId, order.delete);
/* ------------------------------------------------------- */
module.exports = router;
