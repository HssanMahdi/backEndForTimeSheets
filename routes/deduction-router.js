var express = require('express');
var router = express.Router();
var Deductions=  require('../models/Deductions');
/* create deduction. http://localhost:3000/deductions/add */
router.post('/add',function(req, res, next){
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a deduction',
        })
    }

    const deduction = new Deductions(body)

    if (!deduction) {
        return res.status(400).json({ success: false, error: err })
    }

    deduction
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                id: deduction._id,
                message: 'deduction created!',
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: 'deduction not created!',
            })
        })
});

/* show all deduction. http://localhost:3000/deductions/show */
router.get('/show',function (req,res) {
    Deductions.find({}, (err, deductions) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        return res.status(200).json(deductions)
    }).catch(err => console.log(err))
})

/* update deductions. http://localhost:3000/deductions/update/id */
router.put('/update/:id',function (req,res) {

    if (!req.body) {
        return res.status(400).send({
            message: "Data to update can not be empty!"
        });
    }
    const id = req.params.id;
    Deductions.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot update deduction with id=${id}. Maybe deduction was not found!`
                });
            } else res.send({ message: "deduction was updated successfully." });
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating deduction with id=" + id
            });
        });

})
/* delete deduction. http://localhost:3000/deductions/delete/id */
router.delete('/delete/:id',function (req,res) {
    Deductions.findOneAndDelete({ _id: req.params.id }, (err, deduction) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!deduction) {
            return res
                .status(404)
                .json({ success: false, error: `deduction not found` })
        }

        return res.status(200).json({ success: true, data: deduction })
    }).catch(err => console.log(err))
})

module.exports = router;
