const Employee = require("../models/Employee");
const Company = require("../models/Company");
const bcrypt = require("bcrypt");
const generateToken = require("../config/generateToken");
const jwt = require("jsonwebtoken");
const send = require("../middlewares/mailMiddleware");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const employee = await Employee.findOne({ email });
    if (employee && (await employee.matchPassword(password))) {
      res.send({
        employee,
        token: generateToken(employee._id),
      });
    } else {
      res.status(401);
      res.json("Invalid E mail or Password");
    }
  } catch (error) {
    res.status(500).send(error.message);
    console.log(error.message);
  }
};

const signUp = async (req, res) => {
  try {
    const { email, password } = req.body;
    const employeeExists = await Employee.findOne({ email });
    if (employeeExists) {
      res.status(500).send("email already exists");
    }
    req.body.password = await bcrypt.hash(password, 3);
    const newEmployee = await Employee.create(req.body);
    if (newEmployee) {
      res.status(201).send({
        newEmployee,
      });
    }
  } catch (error) {
    res.status(500).send(error.message);
    console.log(error.message);
  }
};

const companysEmployees = async (req, res) => {
  try {
    // const employees = await Employee.find().find({_id:{$ne:req.employee._id}}).find({company:{$eq:req.employee.company}});
    const keyword = req.query.search
      ? {
          $or: [
            { userName: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};
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

const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const employee = await Employee.findOne({ email });
    if (employee) {
      const token = generateToken(employee._id);
      const link = `http://localhost:3001/employee/reset-password/${token}`;
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/plain");
      await send(employee.email, link).catch(console.error.message);
      res.send("mail sent");
    } else {
      res.status(401);
      res.send(
        "That address is either invalid or is not associated with a user account"
      );
    }
  } catch (error) {
    res.status(500).send(error.message);
    console.log(error.message);
  }
};
const changePassword = async (req, res) => {
  try {
    const { token } = req.params;
    const newPassword = req.body.password;
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET,
      async function (err, decoded) {
        if (err) {
          console.log(err.message);
          res.status(401);
          res.send("This link is invalid or expired");
        } else {
          const newPasswordHashed = await bcrypt.hash(newPassword, 3);
          await Employee.updateOne(
            { _id: decoded.id },
            { $set: { password: newPasswordHashed } }
          );
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

const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findOneAndRemove({
      _id: { $eq: idEmployee },
    });
    if (employee) {
      res.status(200);
      res.send("Deleted successfully");
    } else {
      res.status(401);
      res.send("Problem with deleting");
    }
  } catch (error) {
    res.status(500).send(error.message);
    console.log(error.message);
  }
};

const signUpInACompany = async (req, res) => {
  try {
    const { token } = req.params;
    const newEmployee = req.body;
    const email = newEmployee.email;
    res.send(newEmployee);
    const employeeExists = await Employee.findOne({ email });
    if (employeeExists) {
      res.status(403).send("email already exists");
    }
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET,
      async function (err, decoded) {
        if (err) {
          console.log(err.message);
          res.status(401);
          res.send("This link is invalid or expired");
        } else {
          let inviter = await Employee.findById(decoded.id).select(
            "company -_id"
          );
          newEmployee.company = inviter.company;
          let password = await bcrypt.hash(newEmployee.password, 3);
          newEmployee.password = password;
          const newEmployeeSaved = await Employee.create(newEmployee);
          if (newEmployeeSaved) {
            res.status(201);
          } else {
            res.status(500).send("Problem with Server");
          }
        }
      }
    );
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
};
