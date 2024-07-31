"use strict";

/* -------------------------------------------------------
| FULLSTACK TEAM | NODEJS / EXPRESS |
------------------------------------------------------- */
const router = require("express").Router();
const { token } = require("../controllers/token");
const checkId = require("../middlewares/checkId");
/* ------------------------------------------------------- */

router.route("/")
.get(token.list).post(token.create);
router
  .route("/:id")
  .get(checkId, token.read)
  .put(checkId, token.update)
  .delete(checkId, token.delete);
/* ------------------------------------------------------- */
module.exports = router;
