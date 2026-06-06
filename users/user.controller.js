const userModel = require( '../users/user.model' );
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
require('dotenv').config();


const uploadPic = async (req, res) => {
    try {
        const userId = req.params.userId;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ message: "Please upload an image file" });
        }

        // 🛠️ ফোল্ডার স্ট্রাকচার অনুযায়ী URL সংশোধন করা হলো 
        // (যেহেতু app.js এ আমরা public/uploads কে '/uploads' হিসেবে স্ট্যাটিক করেছি)
        const baseUrl = "http://192.168.0.106:3000"; 
        const profilePicUrl = `${baseUrl}/uploads/profile_pics/${file.filename}`;

        // ডাটাবেজে ছবির URL সেভ করা
        const user = await userModel.findByIdAndUpdate(
            userId,
            { profilePicUrl: profilePicUrl },
            { new: true } 
        );

        res.status(200).json({
            message: "Profile picture uploaded successfully",
            imageUrl: profilePicUrl,
            user: user
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // ফিল্ডগুলো ঠিকঠাক আসছে কিনা চেক
    if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields (username, email, password) are required" });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: "User already exists with this email" });
    }

    const hashPass = await bcrypt.hash(password, saltRounds);

    const newUser = new userModel({
      username,
      email,
      password: hashPass,
    });

    await newUser.save();

    res.status(201).json({
        message: "User registered successfully",
        user: {
            id: newUser._id,
            username: newUser.username,
            email: newUser.email
        }
    });

  } catch (error) {
    console.error("Signup Error Details:", error); // নোড কনসোলে এরর প্রিন্ট হবে
    res.status(500).json({ message: error.message });
  }
};
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email: email });
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const validUser = await bcrypt.compare(password, user.password);
        if (!validUser) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        const token = jwt.sign(
            { username: user.username, userID: user._id },
            process.env.SECRET_KEY,
            { expiresIn: '1d' }
        );

        // 🔥 এখানে profilePicUrl এবং বাকি সব ডেটা একসাথে রিটার্ন করা হচ্ছে
        res.status(200).json({
            message: "Login successful",
            jwt: token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                profilePicUrl: user.profilePicUrl || "" // ফ্লাটার এই কী-টি রিড করবে
            }
        });

    } catch (error) {
         res.status(500).json({ message: error.message });
    }
}

const updateCurrency = async (req, res) => {

    try {

        const { userId, currency } = req.body;

        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        user.currency = currency;
        await user.save();

        res.status(200).json({
            message: "Currency updated successfully",
            currency: user.currency
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// user.controller.js এর নিচে এটি যোগ করুন
const updateUsername = async (req, res) => {
    try {
        const { userId, username } = req.body; // মঙ্গোডিবি স্কিমা অনুযায়ী username

        const user = await userModel.findByIdAndUpdate(
            userId,
            { username: username },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "Username updated successfully",
            username: user.username
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// 🔥 প্রোফাইল পিকচার ডিলিট করার নতুন কন্ট্রোলার ফাংশন
const deletePic = async (req, res) => {
    try {
        const userId = req.params.userId;

        // মঙ্গোডিবি স্কিমা অনুযায়ী profilePicUrl ফিল্ডের ভ্যালু ফাঁকা ("") করে দেওয়া হচ্ছে
        const user = await userModel.findByIdAndUpdate(
            userId,
            { profilePicUrl: "" },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "Profile picture removed successfully from database",
            user: user
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};




module.exports = { createUser, loginUser, uploadPic, updateCurrency,updateUsername,deletePic };