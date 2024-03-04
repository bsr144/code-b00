const express = require("express");
const router = express.Router();

const profileRoutes = require("./profile");
const commentRoutes = require("./comment");
const userRoutes = require("./user");

router.use("/profiles", profileRoutes);
router.use("/comments", commentRoutes);
router.use("/users", userRoutes);

module.exports = router;
