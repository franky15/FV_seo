const express = require("express");
const controllerUser = require("../controllers/controllerUser");


const router = express.Router();



router.post("/signup", controllerUser.signup);
router.post("/login", controllerUser.login); 
router.post("/delete", controllerUser.deleteUser); 
router.post("/update", controllerUser.updateUser); 

module.exports = router;
