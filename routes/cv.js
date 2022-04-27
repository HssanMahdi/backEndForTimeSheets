var Task = require('../models/Task')
var CV = require('../models/CV')
var Employee = require('../models/Employee');
var express = require('express');
const Project = require('../models/Project');
const { route } = require('express/lib/application');
const req = require('express/lib/request');
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const pathh = require("path");
const CVController = require("../controllers/cvController");
const { networkInterfaces } = require('os');



// add cv 
router.post('/addCV/:id', async (req, res) => {
    var id=req.params.id
    var cv = new CV({
        technicalSkills: req.body.technicalSkills,
        functionalSkills: req.body.functionalSkills,
        //projects:req.body.projects, 
        employee: id
    })
    try {
        const newCV = await cv.save()
        Employee.findByIdAndUpdate({ _id: id }, { $set: { cv: newCV } }).then(cv => {
            console.log(cv);
        })       
        res.status(201).json(newCV)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

//get cv for employee
router.get('/getEmployeeAndCV/:id', async (req, res) => {
    const id = req.params.id
    try {
        const employee = await Employee.findById(id)
        console.log(employee.cv)
        const cv = await CV.findById(employee.cv)
        employee.cv= cv
        res.json(employee)
    }
    catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// //get all cvs
router.get('/allCvs', async (req, res) => {
    try {
        const cvs = await CV.find();
        res.json(cvs)
        console.log(cvs)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})
//update cv
router.patch('/:id', async (req, res) => {
    const cv = await CV.findById(req.params.id)
    if (req.body.technicalSkills != null) {
        cv.technicalSkills = req.body.technicalSkills
    }
    if (req.body.functionalSkills != null) {
        cv.functionalSkills = req.body.functionalSkills
    }
    try {
        const updatedCV = await cv.save()
        res.json(updatedCV)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})



const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!fs.existsSync("public")) {
      fs.mkdirSync("public");
    }
    if (!fs.existsSync("public/videos")) {
      fs.mkdirSync("public/videos");
    }
    cb(null, "public/videos");
  },
  filename: function (req, file, cb) {
    
    cb(null,Date.now() +'_'+file.originalname);
  },
});


const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    var ext = pathh.extname(file.originalname);

    if (ext !== ".mkv" && ext !== ".mp4") {
      return cb(new Error("Only videos are allowed!"));
    }
    cb(null, true);
  },
});
//backendUrl/public/videos/file_name.mp4
//add with video
router.post(
    "/create",
    upload.fields([
      {
        name: "video",
        maxCount: 5,
      },
    ]),
    CVController.create
  );
// router.post('/addCVWithVideo',upload.fields([{name:"videos",maxCount:5}]),async (req,res)=>{

// let videoPaths=[];
//    if (Array.isArray(req.files.videos) && req.files.videos.length>0){
//        for(let video of req.files.videos){
//            videosPaths.push('/' + video.path)
//        }
//    }
//    try{
//        const createcv= await cv.create({
//         videos:videosPaths   
//        })
//        res.json({message:'cv created',createcv})
//    }catch(error){
//        console.log(error)
//        res.status(400).json({ message: err.message })
//    }
// })

module.exports = router
