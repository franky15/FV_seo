const express = require("express");
const mongoose = require("mongoose");




const routerArticles = require("./routes/routesArticle");
const routerUser = require("./routes/routesUser");
const path = require('path');

const app = express();

//importation du package pour les variables d'environnement
const dotenv = require("dotenv");
const result = dotenv.config();

//connection avec la base de données
mongoose.connect( `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.6o7rqq9.mongodb.net/?retryWrites=true&w=majority`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

//permet de capter toutes les requêtes qui contiennent du json dans le but d'y avoir accès 
app.use(express.json())

//permet d'éviter les erreurs cors
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

  app.use("/api", routerArticles);
  app.use("/api/auth", routerUser)


module.exports = app;