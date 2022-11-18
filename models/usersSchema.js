const mongoose = require("mongoose");

const uniqueValidator = require("mongoose-unique-validator");

const usersSchema = mongoose.Schema({
   
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    tel: {type: Number},
    country: {type: String, required: true},
    city: {type: String, required: true},
    postalCode: {type: Number, required: true},
    email: {type: String, required: true , unique: true},
    password: {type: String, required: true}
});

usersSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Users", usersSchema)


/*{
    firstName: "merlin",
    lastName: "enyegue",
    tel: 0762191793,
    country: "france",
    city: "saintes",
    postalCode: 17100,
    email: "roger@mail.fr",
    password: "merlin"
}*/