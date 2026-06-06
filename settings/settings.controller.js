const User = require("../users/user.model");
const bcrypt = require("bcrypt");

// GET PROFILE
const getProfile = async (req, res) => {

    try {

        const { userId } = req.params;

        const user = await User.findById(userId).select("-password");

        res.status(200).json(user);

    } catch (error) {

        res.status(500).json({ message: error.message });

    }
};


// UPDATE PROFILE (username/email/currency/darkMode)
const updateSettings = async (req, res) => {

    try {

        const { userId } = req.params;

        const { username, email, currency, darkMode } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                username,
                email,
                currency,
                darkMode
            },
            { new: true }
        ).select("-password");

        res.status(200).json({
            message: "Settings updated",
            user: updatedUser
        });

    } catch (error) {

        res.status(500).json({ message: error.message });

    }
};


// CHANGE PASSWORD
const changePassword = async (req, res) => {

    try {

        const { userId, oldPassword, newPassword } = req.body;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Old password wrong" });
        }

        const hash = await bcrypt.hash(newPassword, 10);

        user.password = hash;
        await user.save();

        res.status(200).json({ message: "Password updated" });

    } catch (error) {

        res.status(500).json({ message: error.message });

    }
};




module.exports = {
    getProfile,
    updateSettings,
    changePassword
};