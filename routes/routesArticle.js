const express = require('express');
const controllerArticle = require("../controllers/controllerArticle");
const auth = require("../middleware/auth")


const router = express.Router();

router.get("/test", controllerArticle.test)


module.exports = router;