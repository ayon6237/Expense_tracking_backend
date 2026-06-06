const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');
const express = require('express');
const path = require('path');
const cors = require('cors');

const userrouter = require('./users/user.route');
const expenserouter = require('./expense/expense.route');
const settingsRoute = require("./settings/settings.route");

const app = express();

// ১. সবার আগে CORS এবং বডি পার্সার থাকতে হবে
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ২. রাউটারগুলোর আগেই স্ট্যাটিক ফোল্ডার ডিক্লেয়ার করতে হবে
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// ৩. সবশেষে রাউটারসমূহ
app.use(userrouter);
app.use(expenserouter);
app.use(settingsRoute);

const port = process.env.PORT || 3000;

// database connection
mongoose.connect(process.env.DB_URL)
    .then(() => {
        console.log("Database is connected")
    })
    .catch((error) => {
        console.log(error.message)
    });

app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${port}`);
});