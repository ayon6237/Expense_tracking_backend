// utils/image_upload.js
const multer = require('multer');
const path = require('path');

// ফাইল স্টোরেজ কনফিগারেশন
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // ছবিগুলো কোন ফোল্ডারে সেভ হবে
        cb(null, 'public/uploads/profile_pics/'); 
    },
    filename: function (req, file, cb) {
        // ফাইলটির একটি ইউনিক নাম দেওয়া (ইউজার আইডি + এক্সটেনশন)
        const userId = req.params.userId; 
        const extension = path.extname(file.originalname);
        cb(null, `${userId}${extension}`);
    }
});

// ফাইল ফিল্টার করা (শুধু ইমেজ ফাইল অনুমোদিত)
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(new Error('Only JPEG and PNG files are allowed'), false);
    }
};

// Multer অবজেক্ট তৈরি করা
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 5 // ফাইলের সর্বোচ্চ সাইজ ৫ এমবি
    }
});

module.exports = upload;