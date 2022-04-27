var express = require('express');
var router = express.Router();
var Leaves=  require('../models/Leaves');
const Employee = require("../models/Employee");
const Salary = require("../models/Salary");
/* create leave. http://localhost:3000/leaves/add */
router.post('/add',function(req, res, next){
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a leave',
        })
    }

    const leave = new Leaves(body)

    if (!leave) {
        return res.status(400).json({ success: false, error: err })
    }

    leave
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                id: leave._id,
                message: 'leave created!',
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: 'leave not created!',
            })
        })
});

/* show all leave. http://localhost:3000/leaves/show */
router.get('/show',function (req,res) {
    Leaves.find({}, (err, leaves) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        return res.status(200).json(leaves)
    }).catch(err => console.log(err))
})

/* update leaves. http://localhost:3000/leaves/update/id */
router.put('/update/:id',function (req,res) {

    if (!req.body) {
        return res.status(400).send({
            message: "Data to update can not be empty!"
        });
    }
    const id = req.params.id;
    Leaves.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot update leave with id=${id}. Maybe leave was not found!`
                });
            } else res.send({ message: "leave was updated successfully." });
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating leave with id=" + id
            });
        });

})
/* delete leave. http://localhost:3000/leaves/delete/id */
router.delete('/delete/:id',function (req,res) {
    Leaves.findOneAndDelete({ _id: req.params.id }, (err, leave) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!leave) {
            return res
                .status(404)
                .json({ success: false, error: `leave not found` })
        }

        return res.status(200).json({ success: true, data: leave })
    }).catch(err => console.log(err))
})



/* update leave status. http://localhost:3000/leaves/updateStatus/:id/:statuss */
router.get('/updateStatus/:id/:statuss',function (req,res) {


    const id = req.params.id;
    const status =req.params.statuss;
    Leaves.updateOne(
        { _id: id },
        { $set: { status: status } }
    ).then(()=>{
        res.send({ message: "status was updated." })})
})

/* show all leave. http://localhost:3000/leaves/showByName/:namee */
router.get('/showByName/:namee',function (req,res) {
   const usernamee = req.params.namee
    Leaves.find({userName:usernamee}, (err, leaves) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        return res.status(200).json(leaves)
    }).catch(err => console.log(err))
})

/* show all leave. http://localhost:3000/leaves/pending */
router.get('/pending',function (req,res) {
    Leaves.find({status:"Pending"}, (err, leaves) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        return res.status(200).json(leaves);
    }).catch(err => console.log(err))
})

/* show all leave. http://localhost:3000/leaves/plannedToday */
let datenow = new Date();


router.get('/plannedToday',function (req,res) {
    Leaves.find({leaveEnd : {$gte : datenow},leaveStart : {$lte : datenow},status:"Approved"}, (err, leaves) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        return res.status(200).json(leaves);
    }).catch(err => console.log(err))
})

/* update leave status. http://localhost:3000/leaves/updateTaken/:userName/:nbDays */
router.get('/updateTaken/:userName/:nbDays',function (req,res) {


    const username = req.params.userName;
    const days = req.params.nbDays;
    Employee.updateOne(
        { userName: username},
        { $inc: { leavesTaken: days} }
    ).then(()=>{
        res.send({ message: "status was updated." })})
})


/* reset all leaves. http://localhost:3000/leaves/resetLeaves/maxleaves */
router.get('/resetLeaves/:maxLeaves',function (req,res) {


    const maxleaves = req.params.maxLeaves;

    Employee.updateMany(
        { },
        { leavesTaken: 0,leavesLeft: maxleaves }
    ).then(()=>{
        res.send({ message: " max leaves updated" })})
})


/* reset all leaves. http://localhost:3000/leaves/deleteAll */
router.get('/deleteAll',function (req,res) {




    Leaves.remove(
        { }
    ).then(()=>{
        res.send({ message: " All leaves deleted" })})
})


/* paid leaves to salary. http://localhost:3000/leaves/paidLeave/:userName/:nbDays */
router.get('/paidLeave/:userName/:nbDays',function (req,res) {


    const username = req.params.userName;
    const days = req.params.nbDays;
  const  Addedammount=days*15*8;
    Salary.updateOne(
        { userName: username},
        { $inc: { totalSalary: Addedammount} }
    ).then(()=>{
        res.send({ message: "paid leave was added." })})
})

module.exports = router;
