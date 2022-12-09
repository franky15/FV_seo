const jwt = require("jsonwebtoken");
//importation du package pour les variables d'environnement
const dotenv = require("dotenv").config();

module.exports = (req, res, next) => {
   try {   const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);
        const userId = decodedToken.userId;
        req.auth = { //création de l'objet auth dans la req ce qui donnera auth: {userId: userId}
            userId: userId
        };
        next();
    }
    catch(error ) {
        res.status(401).json({message: "non autorisé : " + error})
    }
}; 