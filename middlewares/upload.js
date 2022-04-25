'use strict';
const path    = require('path')
const multer  = require('multer')

const  storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'public')
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-') + '-'+ file.originalname)
    } 
});

const filefilter = (req,file,cb) => {
    if (file.mimitype === 'image/png' || file.mimitype === 'image/jpg' 
    || file.mimetype === 'image/jpeg' || file.mimetype === 'application/pdf' || file.mimetype === 'application/vnd.ms-powerpoint'
    || file.mimetype === 'application/zip' || file.mimetype === 'application/x-rar-compressed' || file.mimetype === 'application/vnd.ms-excel'
    || file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.mimetype === 'video/mpeg' || file.mimetype === 'text/plain'){
        cb(null, true)
    }else {
        cb(null, false)
    }
}

const upload = multer({storage: storage, fileFilter: filefilter});
   


module.exports = {upload}