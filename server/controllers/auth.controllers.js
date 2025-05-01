const User = require("../models/user.models");
const jwt = require("../utils/jwt.utils");
const bcrypt = require("bcryptjs");

exports.signup = async(req, res) => {
    try {
        const { username, password, phoneNumber, email } = req.body;
        const existingUser = await User.findOne({ username });
        if(username){
            return res.status(400).json({ error : "User already exists" });
        }

        const hashed_password = await bcrypt.hash(password, 10);
        const user = new User({
            username,
            password : hashed_password,
            phoneNumber,
            email
        });
        await user.save();
        
        const token = jwt.generateToken({ id : user._id, role : user.role});
        res.status(201).json({ token });
    }
    catch(error){
        res.status(500).json({ error : "Failed to signup" });
    }
};

exports.login = async(req, res) => {
    try{
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if(!user || !(await bcrypt.compare(password, user.password))){
            return res.status(401).json({ error : "Invalid credentials"});
        }

        const token = jwt.generateToken({ id : user._id });
        res.json({ token });
    }
    catch(error){
        res.status(500).json({ error : "Failed to login"});
    }
};