var express = require('express');
const { login, signUp, companysEmployees, forgetPassword, changePassword, deleteEmployee, signUpInACompany } = require('../controllers/employees.controller');
const { protect } = require('../middlewares/authMiddleware');
var router = express.Router();

router.get('/', protect, companysEmployees)
router.post('/login', login);
router.post('/signup', signUp);
router.post('/signup/:token', signUpInACompany);
router.post('/forget-password', forgetPassword);
router.post('/reset-password/:token', changePassword);
router.delete('/', protect, deleteEmployee);
// router.put('/',);

module.exports = router;
