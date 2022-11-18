const express = require("express");
const controllerUser = require("../controllers/controllerUser");
const auth = require("../middleware/auth")

const router = express.Router();



router.post("/signup", controllerUser.signup);
router.post("/login", controllerUser.login); 

module.exports = router;