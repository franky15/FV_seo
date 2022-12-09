const express = require('express');

const controllerArticle = require("../controllers/controllerArticle");

const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");



const router = express.Router();

//Articles
router.post("/" ,auth,multer,controllerArticle.createArticle); //administrateur //auth,
router.put("/articles/:id", auth,multer,controllerArticle.updateArticle); //administrateur //auth,
router.delete("/articles/:id", auth, multer, controllerArticle.deleteArticle); //administrateur //auth,
router.get("/",controllerArticle.getAllArticles);  //, auth
router.get("/articles/:id",controllerArticle.oneArticle);//, auth

//likes et dislikes
router.post("/likes/:id", auth,controllerArticle.likeCreate); 


//Reviews
router.post("/", auth, controllerArticle.createReview); //auth,
router.put("/reviews/:id", auth, controllerArticle.updateReview); //auth,
router.delete("/reviews/:id", auth,controllerArticle.deleteReview); //auth,
router.get("/reviews/:id", auth,controllerArticle.oneReview); 







module.exports = router;
