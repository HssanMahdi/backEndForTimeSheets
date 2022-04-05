var express = require('express');
var router = express.Router();
var Overtime=  require('../models/Overtime');
/* create overtime. http://localhost:3000/overtime/add */
router.post('/add',function(req, res, next){
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a overtime',
        })
    }

    const overtime = new Overtime(body)

    if (!overtime) {
        return res.status(400).json({ success: false, error: err })
    }

    overtime
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                id: overtime._id,
                message: 'overtime created!',
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: 'overtime not created!',
            })
        })
});

/* show all overtime. http://localhost:3000/overtime/show */
router.get('/show',function (req,res) {
    Overtime.find({}, (err, overtime) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        return res.status(200).json(overtime)
    }).catch(err => console.log(err))
})

/* update overtime. http://localhost:3000/overtime/update/id */
router.put('/update/:id',function (req,res) {

    if (!req.body) {
        return res.status(400).send({
            message: "Data to update can not be empty!"
        });
    }
    const id = req.params.id;
    Overtime.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot update overtime with id=${id}. Maybe overtime was not found!`
                });
            } else res.send({ message: "overtime was updated successfully." });
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating overtime with id=" + id
            });
        });

})
/* delete overtime. http://localhost:3000/overtime/delete/id */
router.delete('/delete/:id',function (req,res) {
    Overtime.findOneAndDelete({ _id: req.params.id }, (err, overtime) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!overtime) {
            return res
                .status(404)
                .json({ success: false, error: `overtime not found` })
        }

        return res.status(200).json({ success: true, data: overtime })
    }).catch(err => console.log(err))
})

module.exports = router;
