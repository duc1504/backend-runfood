const express = require("express");
const router = express.Router();
const User = require("../models/user.model");
const bcrypt = require("bcrypt");

// Sign up
router.post("/signup", async (req, res) => {
    const { name, email, phone, password,role } = req.body;

    if (!name || !email || !phone || !password) {
        return res
            .status(400)
            .json({ status: false, error: "Please provide all required fields" });
    }

    try {
        const user = await User.findOne({ email });
        if (user) {
            return res
                .status(400)
                .json({ status: false, error: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name,
            email,
            phone,
            role,
            password: hashedPassword,
        });

        const savedUser = await newUser.save();
        
        // Chuyển đổi đối tượng người dùng thành JSON và loại bỏ mật khẩu
        const userResponse = savedUser.toObject();
        delete userResponse.password;

        res.json({ status: true, data: userResponse });
    } catch (error) {
        res.status(400).json({ status: false, error: error.message });
    }
});
// Sign in
router.post("/signin", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res
            .status(400)
            .json({ status: false, error: "Please provide all required fields" });
    }
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res
                .status(400)
                .json({ status: false, error: "User not found" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res
                .status(400)
                .json({ status: false, error: "Incorrect password" });
        }
        res.json({ status: true, data: user });
    } catch (error) {
        res.status(400).json({ status: false, error: error.message });
    }
});
// get all users
router.get("/", async (req, res) => {
    try {
        const users = await User.find({role:'user'}).select('-password').sort({ createdAt: -1 });
        res.json({ status: true, data: users });
    } catch (error) {
        res.json({ status: false, error: error });
    }
});

module.exports = router;