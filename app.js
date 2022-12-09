const express = require("express");
//const mongoose = require("mongoose");

//importation du package pour les variables d'environnement
const dotenv = require("dotenv").config();

const routerArticles = require("./routes/routesArticle");
const routerUser = require("./routes/routesUser");

//permet de lier multer avec le server
const path = require('path');

//creation de l'app avec express
const app = express();

//permet de capter toutes les requêtes qui contiennent du json dans le but d'y avoir accès 
app.use(express.json())

//permet d'éviter les erreurs cors
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

  app.use("/api/auth", routerUser); 
  app.use("/api", routerArticles); //router articles, commentaire, likes dislikes
  app.use('/images', express.static(path.join(__dirname, 'images')));
  

module.exports = app;