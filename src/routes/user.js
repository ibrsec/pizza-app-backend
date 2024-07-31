"use strict"


/* -------------------------------------------------------
| FULLSTACK TEAM | NODEJS / EXPRESS |
------------------------------------------------------- */
const router = require('express').Router()
const { user } = require('../controllers/user')
const checkId = require('../middlewares/checkId')
/* ------------------------------------------------------- */

router.route('/').get(user.list).post(user.create)
router.route('/:id').get(checkId,user.read).put(checkId,user.update).delete(checkId,user.delete)
.put(checkId,user.update).delete(checkId,user.delete)
/* ------------------------------------------------------- */
module.exports = router 