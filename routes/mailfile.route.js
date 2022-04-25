const express =require('express')
const router = express.Router();
const {sendMail} = require('../controllers/mailFile.controller')

router.post("/sendmail", sendMail);

module.exports = router;