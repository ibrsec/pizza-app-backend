"use strict";

/* -------------------------------------------------------
| FULLSTACK TEAM | NODEJS / EXPRESS |
------------------------------------------------------- */
const router = require("express").Router();
const { user } = require("../controllers/user");
const checkId = require("../middlewares/checkId");
const { permissions } = require("../middlewares/permissions");
/* ------------------------------------------------------- */

router
  .route("/")
  .get(permissions.isLogin, user.list)
  .post(user.create);

  router
  .route("/:id")
  .get(permissions.isLogin, checkId, user.read)
  .put(permissions.isLogin, checkId, user.update)
  .delete(permissions.isLogin, checkId, user.delete)
  
  
  router.post('/createAdmin', user.createAdminUser);
/* ------------------------------------------------------- */
module.exports = router;
