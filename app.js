const express = require("express");
const mongoose = require("mongoose");

const app = express();

//connection avec la base de données
mongoose.connect('mongodb+srv://FV_seo:Frankyvan95@cluster0.oymoqnv.mongodb.net/?retryWrites=true&w=majority',
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

app.get("/api/test", (req, res) => {
    res.json({message: "votre message est reçu avec test"})
})

module.exports = app;