const User = require("../models/user.models");
const jwt = require("../utils/jwt.utils");
const bcrypt = require("bcryptjs");

exports.signup = async (req, res) => {
    try {
        const { username, password, phoneNumber, email } = req.body;
        const existingUser = await User.findOne({ username });
        if (existingUser) { // Fixed: if(username) → if(existingUser)
            return res.status(400).json({ error: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            username,
            password: hashedPassword, // Fixed: hashed_password → hashedPassword
            phoneNumber,
            email
        });
        await user.save();

        const token = jwt.generateToken({ id: user._id }); // Removed role as per previous changes
        res.status(201).json({ token });
    } catch (error) {
        res.status(500).json({ error: "Failed to signup" });
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password, phoneNumber } = req.body;
        let user = await User.findOne({ username });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // Update phone number if provided
        if (phoneNumber) {
            user.phoneNumber = phoneNumber;
            await user.save();
        }

        const token = jwt.generateToken({ id: user._id });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: "Failed to login" });
    }
};