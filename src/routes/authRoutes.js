const express = require("express");
const router = express.Router();
const { loginUser, loginGoogleUser, registerUser } = require("../controllers/authController");
const { verifyToken } = require("../middlewares/authMiddleware");

router.post("/login", loginUser);
router.post("/logingoogle", loginGoogleUser);
router.post("/register/user", registerUser);

module.exports = router;
