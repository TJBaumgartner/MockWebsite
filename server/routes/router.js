var express = require('express');
var router = express.Router();
const user = require('../controllers/user');
const post = require('../controllers/posts')
const authenticate = require('../controllers/authenticate');

router.post("/user/create", user.sign_up);

router.post("/user/discover", user.discoverList);

router.post("/user/followers", user.followerList);

router.post("/user/following", user.followingList);

router.post("/user/unfollow", user.unfollow);

router.post("/user/follow", user.follow);

router.post("/login", user.login);

router.post("/logout", user.logout);

router.post("/token", user.refresh);

router.get("/homepage", authenticate, user.index);

router.post("/homepage/posts", post.post_list);

router.post("/post/create", post.post_create_post);

router.post("/createFake", user.create_fake);

router.post("/createFakePost", user.create_fake_post);

// router.post("/user/:id/allMessages",authenticate, message.allMessages);

// router.get("/user/:id/profile",authenticate, user.profile);
// router.post("/user/:id/profile",authenticate, user.profileEdit);

module.exports = router;
