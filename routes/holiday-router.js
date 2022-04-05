var express = require('express');
var router = express.Router();
var Holiday=  require('../models/Holidays');
/* create holiday. http://localhost:3000/holidays/add */
router.post('/add',function(req, res, next){
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a holiday',
        })
    }

    const holiday = new Holiday(body)

    if (!holiday) {
        return res.status(400).json({ success: false, error: err })
    }

    holiday
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                id: holiday._id,
                message: 'holiday created!',
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: 'holiday not created!',
            })
        })
});

/* show all holiday. http://localhost:3000/holidays/show */
router.get('/show',function (req,res) {
     Holiday.find({}, (err, holidays) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        return res.status(200).json(holidays )
    }).catch(err => console.log(err))
})

/* update holidays. http://localhost:3000/holidays/update/id */
router.put('/update/:id',function (req,res) {

    if (!req.body) {
        return res.status(400).send({
            message: "Data to update can not be empty!"
        });
    }
    const id = req.params.id;
    Holiday.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot update holiday with id=${id}. Maybe holiday was not found!`
                });
            } else res.send({ message: "holiday was updated successfully." });
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating holiday with id=" + id
            });
        });

})
/* delete holiday. http://localhost:3000/holidays/delete/id */
router.delete('/delete/:id',function (req,res) {
    Holiday.findOneAndDelete({ _id: req.params.id }, (err, holiday) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!holiday) {
            return res
                .status(404)
                .json({ success: false, error: `holiday not found` })
        }

        return res.status(200).json({ success: true, data: holiday })
    }).catch(err => console.log(err))
})

module.exports = router;
