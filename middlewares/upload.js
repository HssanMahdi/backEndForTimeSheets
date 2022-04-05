'use strict';
const path    = require('path')
const multer  = require('multer')

const  storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads')
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-') + '-'+ file.originalname)
    } 
});

const filefilter = (req,file,cb) => {
    if (file.mimitype === 'image/png' || file.mimitype === 'image/jpg' 
    || file.mimetype === 'image/jpeg'){
        cb(null, true)
    }else {
        cb(null, false)
    }
}

const upload = multer({storage: storage, fileFilter: filefilter});
   


module.exports = {upload}