const express = require('express');
const controllerArticle = require("../controllers/controllerArticle");

const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");



const router = express.Router();

//Articles
router.post("/", controllerArticle.test); //administrateur //auth,
router.put("/", controllerArticle.test); //administrateur //auth,
router.delete("/", controllerArticle.test); //administrateur //auth,
router.get("/", controllerArticle.test);  
router.get("/:id", controllerArticle.test);

//likes et dislikes
router.post("/", controllerArticle.test); //auth,

//Reviews
router.post("/", controllerArticle.test); //auth,
router.put("/", controllerArticle.test); //auth,
router.delete("/", controllerArticle.test); //auth,
router.get("/:id", controllerArticle.test); 





module.exports = router;