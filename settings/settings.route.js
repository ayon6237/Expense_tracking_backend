const express = require("express");
const router = express.Router();

const {
    getProfile,
    updateSettings,
    changePassword,
    updateDarkMode
} = require("./settings.controller");

// PROFILE GET
router.get("/user/:userId", getProfile);

// SETTINGS UPDATE
router.put("/user/settings/:userId", updateSettings);

// PASSWORD CHANGE
router.put("/user/change-password", changePassword);


module.exports = router;