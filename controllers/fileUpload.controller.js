'use strict';
const SingleFile = require('../models/SingleFile');
const MultipleFiles = require('../models/MultipleFiles');

const singleFileUpload = async (req, res, next) => {
    try {
        const file = new SingleFile({
            fileName: req.file.originalname,
            filePath: req.file.path,
            fileType: req.file.mimetype,
            fileSize: fileSizeFormatter(req.file.size, 2),  // 0.00
            participants: req.employee._id
        });
        await file.save();
        res.status(201).send('File Uploaded Successfully')
    } catch (error) {
        res.status(400).send(error.message);
    }
}
const multipleFileUpload = async (req, res, next) => {
    try {
        let filesArray = [];
        req.files.forEach(element => {
            const file = {
                fileName: element.originalname,
                filePath: element.path,
                fileType: element.mimetype,
                fileSize: fileSizeFormatter(element.size, 2),
            }
            filesArray.push(file);
        });
        const multipleFiles = new MultipleFiles({
            files: filesArray
        });
        await multipleFiles.save();
        res.status(201).send(req.files);
    } catch (error) {
        res.status(400).send(error.message);
    }
}
const getallSingleFiles = async (req, res, next) => {
    try {
        const files = await SingleFile.find({participants: { $in:[req.employee._id]}});
        res.status(200).send(files);
    } catch (error) {
        res.status(400).send(error.message);
    }
}
const getallMultipleFiles = async (req, res, next) => {
    try {
        const files = await MultipleFiles.find();
        res.status(200).send(files);
    } catch (error) {
        res.status(400).send(error.message);
    }
}
const DeleteSingleFile = async (req, res, next) => {
    try {
        await SingleFile.findOneAndRemove({ _id: req.params.id });
        console.log('File deleted')
        res.status(200).send('File deleted Successfully');
    } catch (error) {
        res.status(400).json(error.message);
    } 
  };
  const DeleteMultipleFiles = async (req, res, next) => {
    try {
        await MultipleFiles.findOneAndRemove({ _id: req.params.id });
        console.log('Files deleted')
        res.status(200).send('Files deleted Successfully');
    } catch (error) {
        res.status(400).json(error.message);
    } 
  };

const fileSizeFormatter = (bytes, decimal) => {
    if(bytes === 0) {
        return '0 Bytes';
    }
    const dm = decimal || 2;
    const sizes = ['Bytes', 'KB','MB','GB','TB','PB','EB','YB','ZB'];
    const index = Math.floor(Math.log(bytes) / Math.log(1000));
    return parseFloat((bytes / Math.pow(1000, index)).toFixed(dm)) + ' ' + sizes[index];
}

module.exports = {
    singleFileUpload,
    multipleFileUpload,
    getallSingleFiles,
    getallMultipleFiles,
    DeleteSingleFile,
    DeleteMultipleFiles
}