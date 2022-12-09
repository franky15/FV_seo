var passwordValidator = require('password-validator');

// Create a schema
var schema = new passwordValidator();

// Add properties to it
schema
.is().min(8)                                    // Minimum length 8
.is().max(100)                                  // Maximum length 100
.has().uppercase()                              // Must have uppercase letters
.has().lowercase()                              // Must have lowercase letters
.has().digits(2)                                // Must have at least 2 digits
.has().not().spaces()                           // Should not have spaces
.is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values










//////////////////////////////////////////////////////////////
/*const mongoose = require("mongoose");

const uniqueValidator = require("mongoose-unique-validator");

const usersSchema = mongoose.Schema({
   
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    tel: {type: Number},
    country: {type: String, required: true},
    email: {type: String, required: true , unique: true},
    password: {type: String, required: true}
});

usersSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Users", usersSchema)
*/

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