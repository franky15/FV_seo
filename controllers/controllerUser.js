const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const User = require("../models/usersSchema");


exports.signup = (req, res,next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                tel: req.body.tel,
                country: req.body.country,
                city: req.body.city,
                postalCode: req.body.postalCode,
                email: req.body.email,
                password: hash
            });
            user.save()
            .then( () => res.status(201).json({message: "Utilisateur crée !"}))
            .catch(error => res.status(400).json({error}));
        })
        .catch(error => res.status(500).json({error}))
};

exports.login = (req, res,next) => {
    User.findOne({email: req.body.email})
        .then(user => {
            
            if(user === null){
                return res.status(401).json({message: "Mot de passe ou adresse mail invalide !"})
                
            }else{
                bcrypt.compare(req.body.password, user.password)
                .then( valid => {
                    if(!valid) {
                        console.log("mot de pass incorrect")
                        return res.status(401).json({message: "Mot de passe ou adresse mail invalide"})
                    }else{
                        console.log("mot de pass correct")
                        res.status(200).json({
                            userId: user._id,
                            token: jwt.sign(
                                {userId: user._id}, //angodage du userId
                                "RANDOM_TOKEN_SECRET", //clé de mon token
                                {expiresIn: "24"}
                            )
                            
                        });
                        
                    }
                   
                })
                .catch(error => res.status(500).json({error}));
            }
            
            
        })
        .catch(error => res.status(500).json({error}))
}
