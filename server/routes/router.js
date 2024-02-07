var express = require('express');
var router = express.Router();
const user = require('../controllers/user');
const authenticate = require('../controllers/authenticate');

router.post("/user/create", user.sign_up);
router.post("/login", user.login);
router.post("/logout", user.logout);
router.post("/token", user.refresh)
router.get("/homepage", authenticate, user.index)

// router.post("/message/send",authenticate, message.messageSend);
// router.get("/user/:id/message",authenticate, message.message);
// router.post("/user/:id/allMessages",authenticate, message.allMessages);

// router.get("/user/:id/profile",authenticate, user.profile);
// router.post("/user/:id/profile",authenticate, user.profileEdit);

module.exports = router;
