var express = require('express');
var router = express.Router();
var Additions=  require('../models/Additions');
/* create additions. http://localhost:3000/additions/add */
router.post('/add',function(req, res, next){
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a additions',
        })
    }

    const additions = new Additions(body)

    if (!additions) {
        return res.status(400).json({ success: false, error: err })
    }

    additions
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                id: additions._id,
                message: 'additions created!',
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: 'additions not created!',
            })
        })
});

/* show all additions. http://localhost:3000/additions/show */
router.get('/show',function (req,res) {
    Additions.find({}, (err, additions) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        return res.status(200).json(additions)
    }).catch(err => console.log(err))
})

/* update additions. http://localhost:3000/additions/update/id */
router.put('/update/:id',function (req,res) {

    if (!req.body) {
        return res.status(400).send({
            message: "Data to update can not be empty!"
        });
    }
    const id = req.params.id;
    Additions.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot update additions with id=${id}. Maybe additions was not found!`
                });
            } else res.send({ message: "additions was updated successfully." });
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating additions with id=" + id
            });
        });

})
/* delete additions. http://localhost:3000/additions/delete/id */
router.delete('/delete/:id',function (req,res) {
    Additions.findOneAndDelete({ _id: req.params.id }, (err, additions) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!additions) {
            return res
                .status(404)
                .json({ success: false, error: `additions not found` })
        }

        return res.status(200).json({ success: true, data: additions })
    }).catch(err => console.log(err))
})

module.exports = router;
