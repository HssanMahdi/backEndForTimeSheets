var express = require('express');
var router = express.Router();
var Salary=  require('../models/Salary');
var Employee=  require('../models/Employee');
/* create salary. http://localhost:3000/salarys/add */
router.post('/add',function(req, res, next){
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a salary',
        })
    }

    const salary = new Salary(body)

    if (!salary) {
        return res.status(400).json({ success: false, error: err })
    }

    salary
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                id: salary._id,
                message: 'salary created!',
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: 'salary not created!',
            })
        })
});

/* show all salary. http://localhost:3000/salarys/show */
router.get('/show',function (req,res) {
    Salary.find({}, (err, salarys) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        return res.status(200).json(salarys)
    }).catch(err => console.log(err))
})

/* update salarys. http://localhost:3000/salarys/update/id */
router.put('/update/:id',function (req,res) {

    if (!req.body) {
        return res.status(400).send({
            message: "Data to update can not be empty!"
        });
    }
    const id = req.params.id;
    Salary.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot update salary with id=${id}. Maybe salary was not found!`
                });
            } else res.send({ message: "salary was updated successfully." });
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating salary with id=" + id
            });
        });

})
/* delete salary. http://localhost:3000/salarys/delete/id */
router.delete('/delete/:id',function (req,res) {
    Salary.findOneAndDelete({ _id: req.params.id }, (err, salary) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!salary) {
            return res
                .status(404)
                .json({ success: false, error: `salary not found` })
        }

        return res.status(200).json({ success: true, data: salary })
    }).catch(err => console.log(err))
})
/* show all employee. http://localhost:3000/salarys/showEmp */
router.get('/showEmp',function (req,res) {
    Employee.find({}, (err, employees) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        return res.status(200).json(employees)
    }).catch(err => console.log(err))
})

/* Find employee by id. http://localhost:3000/salarys/findEmp */
router.get('/findEmp/:id',(req,res,next)=>{
    Employee.findById(req.params.id).then(result=>{res.status(200).json({employee:result})})
})

/* create salary. http://localhost:3000/salarys/addemp */
router.post('/addemp',function(req, res, next){
    const body = req.body

    const salary = new Employee(body)



    salary
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                id: salary._id,
                message: 'salary created!',
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: 'salary not created!',
            })
        })
});



module.exports = router;
