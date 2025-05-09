const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true,
        unique : true,
        trim : true
    },
    email : {
        type : String,
        required : true,
        unique : true,
        trim : true,
        lowercase : true
    },
    password : {
        type : String,
        required : true
    },
    phoneNumber : {
        type : String,
        required : true,
        unique : true,
    },
    createdAt : {
        type : Date,
        default : Date.now
    }
});

module.exports = mongoose.model("User", userSchema);