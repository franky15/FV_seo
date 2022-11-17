const express = require("express");

const router = express.Router();

const controllerUser = require("../controllers/controllerUser");

router.post("/signup", controllerUser .signup);
router.post("/login", controllerUser .login);

module.exports = router;