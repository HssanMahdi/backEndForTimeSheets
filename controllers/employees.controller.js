const Employee = require("../models/Employee");
const Company = require("../models/Company");
const bcrypt = require("bcrypt");
const generateToken = require("../config/generateToken");
const jwt = require("jsonwebtoken");
const send = require("../middlewares/mailMiddleware");
require('dotenv').config();

const login = async(req, res) => {
    try {
        const { email, password } = req.body;
        const employee = await Employee.findOne({ email });
        if (employee && (await employee.matchPassword(password))) {
            await Employee.updateOne({ _id: employee._id }, { $set: { timeLastLogin: new Date() } });
            const employee1 = await Employee.findOne({ email });
            res.send({
                employee1,
                token: generateToken(employee._id),
            });
        } else {
            res.status(401);
            res.json("Invalid Email or Password");
        }
    } catch (error) {
        res.status(500).send(error.message);
        console.log(error.message);
    }
};

const signUp = async(req, res) => {
    try {
        const { email, password, company } = req.body;
        const compToAdd = {
            companyName: company
        }
        const employeeExists = await Employee.findOne({ email });
        if (employeeExists) {
            res.status(403).send("email already exists");
            return
        }
        const newCompany = await Company.create(compToAdd)
        if (newCompany) {
            req.body.password = await bcrypt.hash(password, 3);
            req.body.company = newCompany._id;
            req.body.lastLogin = new Date();
            const newEmployee = await Employee.create(req.body);
            if (newEmployee) {
                res.status(201).send({
                    newEmployee,
                    token: generateToken(newEmployee._id)
                });
            }
        }
    } catch (error) {
        res.status(500).send(error.message);
        console.log(error.message);
    }
};

const companysEmployees = async(req, res) => {
    try {
        // const employees = await Employee.find().find({_id:{$ne:req.employee._id}}).find({company:{$eq:req.employee.company}});
        const keyword = req.query.search ?
            {
                $or: [
                    { userName: { $regex: req.query.search, $options: "i" } },
                    { email: { $regex: req.query.search, $options: "i" } },
                ],
            } :
            {};
        const employees = await Employee.find(keyword).find({
            $and: [
                { _id: { $ne: req.employee._id } },
                { company: { $eq: req.employee.company } },
            ],
        });

        res.send(employees);
    } catch (error) {
        res.status(500).send(error.message);
        console.log(error.message);
    }
};

const forgetPassword = async(req, res) => {
    try {
        const { email } = req.body;
        const employee = await Employee.findOne({ email });
        if (employee) {
            const token = generateToken(employee._id);
            const link = `${process.env.FRONT_END}/resetpassword/${token}`;
            res.status(200)
                // res.setHeader("Content-Type", "text/plain");
            await send(employee.email, link).catch(console.error.message);
            res.send("mail sent");
        } else {
            res.status(401);
            res.send(
                "That address is either invalid or is not associated with a user account"
            );
            return;
        }
    } catch (error) {
        res.status(500).send(error.message);
        console.log(error.message);
    }
};
const changePassword = async(req, res) => {
    try {
        const { token } = req.params;
        const newPassword = req.body.password;
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET,
            async function(err, decoded) {
                if (err) {
                    console.log(err.message);
                    res.status(401);
                    res.send("This link is invalid or expired");
                    return
                } else {
                    const newPasswordHashed = await bcrypt.hash(newPassword, 3);
                    await Employee.updateOne({ _id: decoded.id }, { $set: { password: newPasswordHashed } });
                }
            }
        );
        res.status(200);
        res.send("Password changed successfully");
    } catch (error) {
        res.status(500).send(error.message);
        console.log(error.message);
    }
};

const deleteEmployee = async(req, res) => {
    try {
        const { id } = req.params;
        const employee = await Employee.findOneAndRemove({
            _id: { $eq: id },
        });
        if (employee) {
            res.status(200);
            res.send("Deleted successfully");
        } else {
            res.status(401);
            res.send("Problem with deleting");
            return;
        }
    } catch (error) {
        res.status(500).send(error.message);
        console.log(error.message);
    }
};

const signUpInACompany = async(req, res) => {
    try {
        const { token } = req.params;
        const newEmployee1 = req.body;
        const email = newEmployee1.email;
        const employeeExists = await Employee.findOne({ email });
        if (employeeExists) {
            res.status(403).send("email already exists");
            return
        }
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET,
            async function(err, decoded) {
                if (err) {
                    res.status(401);
                    res.send("This link is invalid or expired");
                    return
                } else {
                    let inviter = await Employee.findById(decoded.id).select(
                        "company -_id"
                    );
                    newEmployee1.company = inviter.company;
                    let password = await bcrypt.hash(newEmployee1.password, 3);
                    newEmployee1.password = password;
                    const newEmployee = await Employee.create(newEmployee1);
                    if (newEmployee) {
                        res.status(201).send({
                            newEmployee,
                            token: generateToken(newEmployee._id)
                        });
                        return
                    } else {
                        res.status(500).send("Problem with Server");
                        return
                    }
                }
            }
        );
    } catch (error) {
        res.status(500).send(error.message);
        console.log(error.message);
    }
};

const updateEmployeeHours = async(req, res) => {
    try {
        const { todaysWorkedHours, totalWorkedHours, overTimeHours } = req.body;
        await Employee.updateOne({ _id: req.employee._id }, {
            $set: {
                todaysWorkedHours: todaysWorkedHours,
                totalWorkedHours: totalWorkedHours,
                overTimeHours: overTimeHours
            }
        });
        res.status(200);
        res.send("Employee Updated successfully");
    } catch (error) {
        res.status(500).send(error.message);
        console.log(error.message);
    }
};

const updateEmployeeNotifications = async(req, res) => {
    try {
        const { notifications } = req.body;
        await Employee.updateOne({ _id: req.employee._id }, {
            $set: {
                notifications: notifications
            }
        });
        res.status(200);
        res.send("Employee Updated successfully");
    } catch (error) {
        res.status(500).send(error.message);
        console.log(error.message);
    }
};

const changeEmployeeState = async(req, res) => {
    try {
        const { id } = req.params;
        const { isManager } = req.body;
        await Employee.updateOne({ _id: id }, {
            $set: {
                isManager: isManager
            }
        });
        res.status(200);
        res.send("Employee Updated successfully");
    } catch (error) {
        res.status(500).send(error.message);
        console.log(error.message);
    }
};
module.exports = {
    login,
    signUp,
    companysEmployees,
    forgetPassword,
    changePassword,
    deleteEmployee,
    signUpInACompany,
    updateEmployeeHours,
    updateEmployeeNotifications,
    changeEmployeeState
};