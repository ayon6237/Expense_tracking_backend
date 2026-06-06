const router = require('express').Router();
const {createUser, loginUser, uploadPic, updateCurrency, updateUsername, deletePic} =require( '../users/user.controller' );
const upload = require('../utils/image_upload');


//signup router
router.post('/register',createUser);
router.post('/login',loginUser);
router.post('/upload/profile/:userId', upload.single('profilePic'),uploadPic);
router.put("/user/currency", updateCurrency);
router.put("/user/username", updateUsername);
router.delete('/upload/profile/:userId', deletePic);
module.exports = router;