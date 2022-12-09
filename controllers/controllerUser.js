const bcrypt = require("bcrypt");  //pour hascher le password
const jwt = require("jsonwebtoken"); //pour créer les tokens de vérification
const  mysql = require("mysql");  //pour intéragir avec base de données
const db = require("../database/db-config");

//importation du package pour les variables d'environnement
const dotenv = require("dotenv").config();

//Inscription de l'utilisateur
exports.signup = (req, res,next) => {

    //stockage de toutes les valeurs de la requete dans des constantes
    const nom = req.body.nom;
    const prenom = req.body.prenom;
    const tel = req.body.tel;
    const pays = req.body.pays;
    const email = req.body.email;
    const role = req.body.adminRole;
   
    
    //hashage du password par bcrypt
    bcrypt.hash(req.body.password, 10) 
        .then(hash => {
            //instantiation de user qui est le model stocké dans la base
            const password = hash;
           
            db.query(`INSERT INTO users ( adminRole ,nom, prenom, pays, tel, email, password ) 
                VALUES ( ${role}, "${nom}", "${prenom}", "${pays}", ${tel}, "${email}", "${password}")`,
                (error, result) => {
                    if(error){
                        
                        console.log(nom)
                        //res.status(400).json({message: "echoueeeeeeeeeee"})
                        console.log("Inscription échouée :" + error)
                        return res.status(400).json({ error })
                    }else{
                        console.log("Utilisateur créé !")
                        
                        let userSql = "SELECT id,  adminRole, nom FROM users WHERE email = ?;"
                        let insertSql = [email]
                        userSql = mysql.format(userSql, insertSql)
                        //creation et connection directe de l'utilisateur
                        db.query(userSql, (error, result) => {
                            //si l'utilisateur ne correspond pas à un utilisateur de la base de données
                            if(result === "" || result == undefined){
                                console.log("----utilisateur introuvable " + error)
                                return res.status(401).json({ error: "Utilisateur introuvable !" });
                            }else{
                                console.log(" -----Utilisateur crée et connecté !")
                                return res.status(201).json({
                                    message: "Utilisateur crée et connecté !",
                                    userId: result[0].id_users,
                                    adminRole: result[0].adminRole,
                                    nom: result[0].nom,
                                    //encodage des données dans le token
                                    token: jwt.sign(
                                        //contenu du token
                                        { userId: result[0].id, nom: result[0].nom, adminRole: result[0].adminRole },
                                        //chaine secret développement temporaire
                                        process.env.TOKEN_KEY,
                                        {expiresIn: "24h"}
                                    ),
                                    
                                })
                            }
                        })
                        // res.status(201).json({ message: "utilisateur crée" })
                       
                    }
                }
            )
                 
             
        })
        .catch(error => res.status(500).json({error}))
};



//connection de l'utilisateur
exports.login = (req, res,next) => {
  
    //stockage de toutes les valeurs de la requete dans des constantes
    const nom = req.body.nom;
    const prenom = req.body.prenom;
    const email = req.body.email;
    const role = req.body.adminRole;

    let userSql = "SELECT id,  adminRole, nom, email, password FROM users WHERE email = ?;"
    let insertSql = [email]
    userSql = mysql.format(userSql, insertSql)
    //récupération de l'email et du password de la base de données
    db.query(userSql, (error, result) => { 
         
        if(result == undefined || result === ""){ //si résult est vide ou null   
                 
           return res.status(401).json({message: "utilisateur non existant : " + error})
        }else{
           
            console.log("bienvenu sur bcrypt"),
            console.log(result[0].password)

            bcrypt.compare(req.body.password, result[0].password) //bcrypt compare les deux hash (base et req)
                .then( valid => {
                    if(!valid) {
                        console.log("mot de pass incorrect")
                        return res.status(401).json({message: "Mot de passe ou adresse mail invalide deuxieme"})
                    }else{
                        console.log("mot de pass correct")
                        res.status(200).json({   //envoie du token au front-ent
                            message: "Utilisateur connecté !",
                            userId: result[0].id, //id_users
                            adminRole: result[0].adminRole,
                            nom: result[0].nom,
                            //encodage des données dans le token
                            token: jwt.sign(
                                //contenu du token
                                { userId: result[0].id, nom: result[0].nom, adminRole: result[0].adminRole },
                                //chaine secret développement temporaire
                                process.env.TOKEN_KEY,
                                {expiresIn: "24h"}
                            ),
                            
                        });
                        
                    }
                
                })
                .catch(error => res.status(500).json({error}));  
        
            
        } 
    });
};

//DELETE suppression de l'utilisateur
exports.deleteUser = (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);
    const userId = decodedToken.userId;

    if(Number(req.params.id) === userId){
        let deleteSql = "DELETE FROM users WHERE id = ?;";
        let deleteInsert = [userId];
        deleteSql = mysql.format(deleteSql, deleteInsert);
        db.query(deleteSql, (error, result) => {
            if(error){
                console.log(" suppression non autorisé : " + error);
                return res.status(401).json({message: "Non autorisé ! " + error});
            }else{
                console.log("utilisateur supprimé : " );
                return res.status(200).json({message: "utilisateur supprimé !" });
            }
        })
    }else{
        console.log("suppression non autorisé : " );
        return res.status(401).json({message: "Non autorisé ! " + error});
    }
};

//UPDATE modification de l'utilisateur
exports.updateUser = (req, res, next) => {
     //stockage de toutes les valeurs de la requete dans des constantes
     const nom = req.body.nom;
     const prenom = req.body.prenom;
     const tel = req.body.tel;
     const pays = req.body.pays;
     const email = req.body.email;

    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);
    const userId = decodedToken.userId;

    if(Number(req.params.id) === userId){
        let updateSql = "UPDATE users SET nom = ?, prenom = ?, pays = ?, tel = ?, password = ?, WHERE id = ?;";
        let updateInsert = [nom, prenom, pays, tel, userId];
        updateSql = mysql.format(updateSql, updateInsert);
        db.query(updateSql, (error, result) => {
            if(error){
                console.log("Échec de modification du user : " + error)
                return res.status(400).json({ error: "Échec de modification du user !" }); 
            }else{
                console.log("user modifié  avec succès!")
                return res.status(200).json({ message: "user modifié  avec succès!" })
            }
        })
    }
};