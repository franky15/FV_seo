
///importation du package pour les variables d'environnement
const dotenv = require("dotenv").config();
const jwt = require("jsonwebtoken"); // Vérifie des tokens
const  mysql = require("mysql");  //pour intéragir avec base de données
const db = require("../database/db-config");
const fs = require("fs");

// POST creation de l'article
exports.createArticle = (req, res, next) => {
   
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);
    const userId = decodedToken.userId;
    const adminRole = decodedToken.adminRole;
    const titre = req.body.titre;
    const contenu = req.body.contenu;
    const auteur = req.body.auteur; 
    const date = req.body.date;
   
    let imageUrl = "";
    if (req.file){
        console.log(req.body)
        imageUrl = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;
    }
    //préparation de la requête sql
    let articlesSql = "INSERT INTO articles (titre, contenu, auteur, imageUrl, id_users, date) VALUES (?, ?, ?, ?, ?, ?)";
    //insersion des valeurs de la requete post dans la requete sql
    let articlesInserts = [ titre, contenu, auteur, imageUrl, userId, date];
    //Assemblage des deux requetes
    unionSql = mysql.format(articlesSql, articlesInserts);
    
    if(adminRole === 0){
        console.log("Non autorisé à créer un article !" ); 
        // console.log(result[0].imageUrl);  
         return res.status(400).json({message: "Non autorisé à créer un article !" })
    }else{
        db.query(unionSql, (error, result) => {
            if(error){
                console.log("Echec de la création de l'article lors de la requete sql : " + error);   
                return res.status(400).json({message: "Echec de la création de l'article lors de la requete sql: " + error})
            }else{
                console.log(result[0].imageUrl);
                return res.status(201).json({message: "article crée avec succès !"})
            }
        })
    }
    
    
};   

//PUT modification de l'article
exports.updateArticle = (req, res, next) => {
   
    delete req.body.userId;
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);
    const userId = decodedToken.userId;
    const adminRole = decodedToken.adminRole;
    //récupération des données de la requete
    const articleId = req.params.id; //le id qui est à la base de donnée il se met automatiquement sur l'article quand on le récupère
    const titre = req.body.titre;
    const contenu = req.body.contenu;
    const auteur = req.body.auteur;  
    const date = req.body.date;
    
    let imageUrl = "";
    //s'il y a un file(image) dans la requete
    if (req.file){
        console.log(req.body)
        imageUrl = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;
    }
    if(adminRole === 0){
        console.log("Non autorisé à modifier un article !" ); 
        // console.log(result[0].imageUrl);  
         return res.status(400).json({message: "Non autorisé à modifier un article !" })
    }else{
         // Préparer la requête SQL pour récupérer l'image
        let imageSql = "SELECT imageurl FROM articles WHERE id = ?;";
        
        //selection des variables qu'il faut mettre à jour
        let updateSql = `UPDATE  articles SET titre = ?, contenu = ?, auteur = ?,  imageUrl = ? WHERE id = ? ;`;
        //insertion des valeurs de la requete dans les requetes sql
        let imageInserts = [articleId];
        let updateSqlInsert = [titre, contenu, auteur, imageUrl, articleId ];
        //assemblage des requetes
        imageSql = mysql.format(imageSql, imageInserts);
        updateSql = mysql.format(updateSql, updateSqlInsert);
        

        //effectuons les requetes auprès de la base de données
        db.query(imageSql, (error, image) => { //modification  de l'image dabord
            if(error){
                console.log("problème requete sql de récupération de l'image : " + error)
                return res.status(400).json({ message: "Tentative de suppression de l'image de l'article échouée ! " + error })
            }else{
                let urlimage = image[0].imageUrl
                if(urlimage !== ""){
                    //extraction du nom de l'image 
                    const filename = urlimage.split("/images/")[1];
                    //suppression de l'image
                    fs.unlink(`images/${filename}`, () => {});
                    console.log("image supprimée")
                }else{
                    console.log("Pas d'image à supprimer !");
                }
            }
            //Qu'il y ait une image ou pas, effectuer la requête auprès de la base de données
            db.query(updateSql,  (error, article) => { //modification de l'article maintenant
                if (error){
                    console.log("Échec de modification de l'article lors de la requete sql : " + error)
                    return res.status(400).json({ error: "Échec de modification de l'article lors de la requete sql ! " + error });
                } else {
                    console.log("aricle " + articleId + " de l'utilisateur " + userId + " modifié !")
                    return res.status(200).json({ message: "L'article a été modifié par l'adminitrateur avec succès !" })
                }
            });
        })
    }
    
   
};

//Delete suppression des de l'article
exports.deleteArticle = (req, res, next) => {

    delete req.body.userId;
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);
    const userId = decodedToken.userId;
    const adminRole = decodedToken.adminRole;
    //récupération des données de la requete
    const articleId = req.params.id; //le id qui est à la base de donnée il se met automatiquement sur l'article quand on le récupère
    
    
    let imageUrl = "";
    //s'il y a un file(image) dans la requete
    if (req.file){
        console.log(req.body)
        imageUrl = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;
    }
    
    if(adminRole === 0){  //vérification si admin ou utilisateur
        console.log("Non autorisé à supprimer un article !" ); 
        // console.log(result[0].imageUrl);  
         return res.status(400).json({message: "Non autorisé à supprimer un article !" })
    }else{
        // Préparer la requête SQL pour récupérer l'image
        let imageSql = "SELECT imageUrl FROM articles WHERE id = ?;";

        //selection des variables qu'il faut mettre à jour
        let deleteSql = `DELETE  FROM articles WHERE id = ?;`

        //insertion des valeurs de la requete dans les requetes sql
        let imageInserts = [articleId];
        let deleteSqlInserts = [articleId];
       // let deleteSqlInsert = [userId, titre, contenu, auteur, imageUrl, id_users, date];
        //assemblage des requetes
        imageSql = mysql.format(imageSql, imageInserts);
        updateSql = mysql.format(deleteSql, deleteSqlInserts);
        
        //effectuons les requetes auprès de la base de données
        db.query(imageSql, (error, image) => { //modification  de l'image dabord
            if(error){
                console.log("erreur  de récupération de l'image lors de la requete sql : " + error)
                return res.status(400).json({ message: "erreur  de récupération de l'image lors de la requete sql! " + error })
            }else{
                let urlimage = image[0].imageUrl
                if(urlimage !== ""){
                    //extraction du nom de l'image 
                    const filename = urlimage.split("/images/")[1];
                    //suppression de l'image
                    fs.unlink(`images/${filename}`, () => {});
                    console.log("image supprimée")
                }else{
                    console.log("Pas d'image à supprimer !");
                }
            }
            //Qu'il y ait une image ou pas, effectuer la requête auprès de la base de données
            db.query(deleteSql,  (error, article) => { //modification de l'article maintenant
                if (error){
                    console.log("Échec de modification de l'article : " + error)
                    return res.status(400).json({ error: "Échec de suppression de l'article ! " + error });
                } else {
                    console.log("aricle supprimé avec succès!")
                    return res.status(200).json({ message: "aricle supprimé avec succès !" })
                }
            });
        })
    }
    
};

//GET Récupération de tous les articles
exports.getAllArticles = (req, res, next) => { 

   /* delete req.body.userId;
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);
    const userId = decodedToken.userId;*/

   let numberArticlesSql = "SELECT COUNT(id) FROM articles;"
   let numberCommentSql = "SELECT COUNT(id) FROM commentaire;"
   let totalLikelSql = "SELECT COUNT(likeDislike) FROM likes WHERE likes.id_articles = articles.id AND likeDislike = 2;" 
   let totalDislikelSql = "SELECT COUNT(likeDislike) FROM likes WHERE likes.id_articles = articles.id AND likeDislike = -2;" 

   let articlesSql = `SELECT * FROM commentaire JOIN articles ON commentaire.id_articles = articles.id JOIN likes ON likes.id_articles = articles.id,
   ${numberArticlesSql}, ${numberCommentSql}, ${totalLikelSql}, ${totalDislikelSql};`
   
    //récupération de tous les articles avec leurs commentaires et like ou dislikes
    db.query(articlesSql, (error, result) => {
        if(error){
            console.log("article non trouvé lors de la requete sql ! " + error);
            return res.status(400).json({message: "article non trouvé lors de la requete sql ! " + error})
        }else{
            console.log("articles et ses données récupérés avec succès : " + result)
            return res.status(200).json(result)
        }

    })
    
};

//GET Récupérer un articles
exports.oneArticle = (req, res, next) => {
   /* delete req.body.userId;
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);
    const userId = decodedToken.userId;*/
    //récupération des données de la requete
    const articleId = req.params.id; //le id qui est à la base de donnée il se met automatiquement sur l'article quand on le récupère
   
   let numberArticlesSql = "SELECT COUNT(id) FROM articles;"
   let numberCommentSql = "SELECT COUNT(id) FROM commentaire;"
   let totalLikelSql = "SELECT COUNT(likeDislike) FROM likes WHERE likes.id_articles = articles.id AND likeDislike = 2;" 
   let totalDislikelSql = "SELECT COUNT(likeDislike) FROM likes WHERE likes.id_articles = articles.id AND likeDislike = -2;"

    let articlesSql = `SELECT * FROM commentaire JOIN articles ON commentaire.id_articles = articles.id JOIN likes ON likes.id_articles = articles.id WHERE (commentaire.id = ${articleId}) AND (articles.id = ${articleId}) AND (likes.id = ${articleId})
    ${numberArticlesSql}, ${numberCommentSql}, ${totalLikelSql}, ${totalDislikelSql};`
    //////
    db.query(articlesSql, (error, result) => {
        if(error){
            console.log("article non trouvé lors de la requete sql ! " + error);
            return res.status(400).json({message: "article non trouvé lors de la requete sql ! " + error})
        }else{
            console.log("article  et ses valeurs trouvé avec succès ! " + result);
            return res.status(200).json({result})
        }
    })
    
};

//POST liker ou disliker
exports.likeCreate = (req, res, next) => { 
    //INSERT INTO likes (id_users, numberLikes, id_articles) VALUES (13, 1, 9); testé sur myqladmin
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);
    const userId = decodedToken.userId;
    //récupération des données de la requete
    let opinion = req.body.numberLikes;
    let dejaNote = req.body.dejaNote;
    let articleId = req.params.id;
   
    //Récupération du like ou dislike de l'utilisateur qui a créé un like
    let likeDislike = `SELECT likeDislike FROM likes WHERE id_articles = ? AND id_users = ?;`
    let likeDislikeInsert = [articleId,userId]
    likeDislike = mysql.query(likeDislike, likeDislikeInsert);
    //

    //Cas où la personne a déjà liké ou disliké
    db.query(dejaNote, (error, dejaNote) => {
        // Préparer la requête SQL pour annuler un like ou dislike sur un post
        let updateLikeDislikeSql = `UPDATE likes SET likeDislike = ${opinion} WHERE id_articles = ? AND id_users = ?;`;
        // Insérer les valeurs du corps de la requête POST dans la requête SQL
        let updateLikeDislikeInserts = [articleId,userId];
        // Assembler la requête d'insertion SQL finale
        updateLikeDislikeSql = mysql.format(updateLikeDislikeSql, updateLikeDislikeInserts);

        if(error){
            console.log("erreur sql de récupération du like ou dislike");
            res.status(400).json({message: "erreur sql de récupération du like ou dislike: " + error})
        }else{
            if(dejaNote[0] === 1){ //si l'utilisateur n'a pas encore liké
                db.query(updateLikeDislikeSql, (error, updateLikeDislikeSql) => { //mis à jour du like ou dislike
                    if(error){
                        console.log("erreur  de mis à jour du like ou dislike lors de la requete sql");
                        return res.status(400).json({message: "erreur  de mis à jour du like ou dislike lors de la requete sql: " + error})
                    }else{
                        console.log(" mis à jour du like ou dislike effectuée avec succès");
                        return res.status(200).json({message: "mis à jour du like ou dislike effectuée avec succès !"})
                    }
                    
                })
            }else{
                // Préparer la requête SQL pour liker un post
                let likeDislikeSql = `INSERT INTO likes (id_users, likeDislike, dejaLikeDislike ,id_articles) VALUES (?, ?, ?, ?);`;
                // Insérer les valeurs du corps de la requête POST dans la requête SQL
                let likeDislikeInserts = [userId, opinion, dejaNote, articleId];
                // Assembler la requête d'insertion SQL finale
                likeDislikeSql = mysql.format(likeDislikeSql, likeDislikeInserts);

                //cas ou l'utilisateur n'a pas encore liké ou disliké fait son premier like
                db.query(likeDislikeSql, (error, likeDislikeSql) =>{
                    if(error){
                        console.log("erreur de l'enregistrement du like ou dislike  lors de la requete sql likeDislikeSql");
                        return res.status(400).json({message: "erreur de l'enregistrement du like ou dislike lors de la requete sql likeDislikeSql: " + error})
                    }else{
                        console.log("avis enregistré avec succès");
                        return res.status(200).json({message: "avis enregistré avec succès! "})
                    }
                })
            }
        }
    })

    
};

//POST creation de reviews
exports.createReview = (req, res, next) => {

    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);
    const userId = decodedToken.userId;
    //récupération des données de la requete
    const review = req.body.reviews;
    let articleId = req.params.id;

    let commentSql = `INSERT INTO commentaire (comment, id_articles, id_users) VALUES (?, ?, ?);`
    let commentInsert = [review, articleId, userId]
    commentSql = mysql.format(commentSql, commentInsert)
    db.query(commentSql, (error, commentSql) => {
        if(error){
            console.log("erreur de création du commentaire lors de la requete sql commentSql : " + error);
            res.status(400).json({message: "erreur de création du commentaire lors de la requete sql commentSql: " + error})
        }else{
            console.log("création du commentaire éffectuée avec succès!");
            res.status(200).json({message: "création du commentaire éffectuée avec succès! "})
        }
    })
 
};

//PUT modification de la review
exports.updateReview = (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);
    const userId = decodedToken.userId;
    //récupération des données de la requete
    let dejaCree = req.body.dejaModifie; 
    const review = req.body.reviews;
    let articleId = req.params.id;

    let commentSql = `UPDATE commentaire SET comment = ? WHERE id_articles = ? AND id_users = ?;`;
    let commentInsert = [review, articleId, userId]
    commentSql = mysql.format(commentSql, commentInsert)

    //récupération de donnée de la base
    let dejaModifieSql = `SELECT dejaModifie FROM commentaire WHERE id_articles = ? AND id_users = ?;`
    let dejaModifieInsert = [articleId, userId]
    dejaModifieSql = mysql.format(dejaModifieSql, dejaModifieInsert)

    db.query(dejaModifieSql, (error, dejaModifieSql) => {
        if(error){
            console.log("erreur de récupération de la donnée du commentaire lors de la requete sql dejaModifieSql");
            return res.status(400).json({message: "erreur de récupération de la donnée du commentaire lors de la requete sql dejaModifieSql: " + error})
        }else{
            if(dejaModifieSql[0] === 1){
                db.query(commentSql, (error, commentSql) =>{
                    if(error){
                        console.log("erreur de la mis à jour du commentaire lors de la requete sql commentSql");
                        return res.status(400).json({message: "erreur de la mis à jour du commentaire lors de la requete sql commentSql: " + error}) 
                    }else{
                        console.log("modification du commentaire éffectuée avec succès");
                        return res.status(200).json({message: "modification du commentaire éffectuée avec succès"}) 
                    }
                })
            }
        }
    })    
};

//DELETE supression du commentaire
exports.deleteReview = (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);
    const userId = decodedToken.userId;
    //récupération des données de la requete
    let articleId = req.params.id;

    let commentSql = "DELETE commentaire WHERE id_articles = ? AND id_users = ?; ";
    let commentInsert = [articleId, userId]
    commentSql = mysql.format(commentSql, commentInsert)

    db.query(commentSql, (error, commentSql) =>{
        if(error){
            console.log("erreur de supression du commentaire lors de la requete sql commentSql");
            return res.status(400).json({message: "erreur de supression du commentaire lors de la requete sql commentSql: " + error}) 
        }else{
            console.log("supression du commentaire éffectuée avec succès");
            return res.status(200).json({message: "supression du commentaire éffectuée avec succès"}) 
        }
    })

};

//GET récupérer une review
exports.oneReview = (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);
    const userId = decodedToken.userId;
    //récupération des données de la requete
    let articleId = req.params.id;

    let commentSql = "SELECT * FROM commentaire WHERE id_articles = ? AND id_users = ?; ";
    let commentInsert = [articleId, userId]
    commentSql = mysql.format(commentSql, commentInsert)

    db.query(commentSql, (error, commentSql) =>{
        if(error){
            console.log("erreur de récupération du commentaire lors de la requete sql commentSql");
            return res.status(400).json({message: "erreur de récupération du commentaire lors de la requete sql commentSql: " + error}) 
        }else{
            console.log("récupération du commentaire éffectuée avec succès");
            return res.status(200).json({commentSql}) 
        }
    })

}


