
//importation du package mysql
const mysql      = require('mysql');
const express = require('express'); //{ query } 


//importation du package pour les variables d'environnement
const dotenv = require("dotenv").config();

const db = mysql.createConnection({
  host     : process.env.DB_HOST,  
  user     : process.env.DB_USERNAME,  
  password :  process.env.DB_PASSWORD,  
  database : process.env.DB_DATABASE 
}); 
 
db.connect(function(error) {
  if (error) {
    console.error('----------connection à my sql échouée : ' + error.stack);
     
    
  }else{
    console.log('------------connexion ok in mysql----------');
  }
   

}); 


module.exports = db;


