const jwt = require("jsonwebtoken");
const Employee = require("../models/Employee");
const asyncHandler = require("express-async-handler");

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      //decodes token id
      const decoded = jwt.verify(token, process.env.JWT_SECRET, async function (err, decoded) {
        if (err) {
          console.log(err)
          res.status(401),
          res.send(err.message)
        } else {
          // console.log(decoded.id)
          req.employee = await Employee.findById(decoded.id).select("-password");
          next();
        }
      })

    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

module.exports = { protect };