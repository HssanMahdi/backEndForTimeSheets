var express = require('express');
var router = express.Router();
var Leaves=  require('../models/Leaves');
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

module.exports = router;
