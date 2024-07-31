"use strict";

/* -------------------------------------------------------
| FULLSTACK TEAM | NODEJS / EXPRESS |
------------------------------------------------------- */
const router = require("express").Router();
const { token } = require("../controllers/token");
const checkId = require("../middlewares/checkId");
const { permissions } = require("../middlewares/permissions");

/* ------------------------------------------------------- */

router
  .route("/")
  .get(permissions.isAdmin, token.list)
  .post(permissions.isAdmin, token.create);
router
  .route("/:id")
  .get(permissions.isAdmin, checkId, token.read)
  .put(permissions.isAdmin, checkId, token.update)
  .delete(permissions.isAdmin, checkId, token.delete);
/* ------------------------------------------------------- */
module.exports = router;
