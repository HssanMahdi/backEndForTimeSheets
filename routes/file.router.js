'use strict';
const express = require('express');
const router = express.Router();
const {upload} = require('../middleware/upload');
const {singleFileUpload, multipleFileUpload, getallSingleFiles, getallMultipleFiles, DeleteSingleFile, DeleteMultipleFiles} = require('../controllers/fileUpload.controller');

 /* add single file*/
router.post('/singleFile', upload.single('file'),singleFileUpload);
 /* add Multiple files*/
 router.post('/multipleFiles', upload.array('files'), multipleFileUpload);
/* get All single Files */
router.get('/getSingleFiles',getallSingleFiles);
/* get All multiple Files */
router.get('/getMultipleFiles',getallMultipleFiles);
/* delete  single Files */
router.delete('/deleteSingleFile/:id', DeleteSingleFile);
/* delete multiple Files */
router.delete('/deleteMultipleFiles/:id',DeleteMultipleFiles);



module.exports = {
    routes: router
}