const Company = require("../models/Company")

const addCompany = async (req, res) => {
    try {
        const { companyName } = req.body
        const companyExists = await Company.findOne({ companyName });
        if (companyExists) {
            res.status(500).json("Company name already exists");
        }
        const newCompany = await Company.create(req.body)
        if (newCompany) {
            res.status(201).json({
                newCompany
            });
        }
    } catch (error) {
        res.status(500).json(error.message)
        console.log(error.message)
    }
};

const inviteNewEmployeesToJoinCompany = async (req, res) => {
    try {
        const company = await Company.find().find({ _id: { $eq: req.employee.company } });
        if (company) {
            const link = `http://localhost:3001/employee/signup/${req.headers.authorization.split(" ")[1]}`;
            res.status(200);
            res.send(link);
        } else {
            res.status(401);
            res.send("Problem with user");
        }
    } catch (error) {
        res.status(500).json(error.message)
        console.log(error.message)
    }
};
module.exports = { addCompany, inviteNewEmployeesToJoinCompany };