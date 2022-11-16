const mongoose = require("mongoose");

const usersSchema = mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true},
    tel: {type: Number},
    country: {type: String, required: true},
    city: {type: String, required: true},
    postalCode: {type: Number, required: true},
    password: {type: String, required: true}
});

module.exports = mongoose.model("Users", usersSchema)