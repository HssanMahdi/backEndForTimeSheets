var express = require('express');
const { login, signUp, companysEmployees, forgetPassword, changePassword, deleteEmployee, signUpInACompany, updateEmployeeHours, updateEmployeeNotifications, changeEmployeeState } = require('../controllers/employees.controller');
const { protect } = require('../middlewares/authMiddleware');
var router = express.Router();

router.get('/', protect, companysEmployees)
router.post('/login', login);
router.post('/signup', signUp);
router.post('/signup/:token', signUpInACompany);
router.post('/forgetpassword', forgetPassword);
router.post('/resetpassword/:token', changePassword);
router.put('/updatehours', protect, updateEmployeeHours);
router.post('/updatenotifs', protect,updateEmployeeNotifications);
router.put('/changeemployeestate/:id',protect,changeEmployeeState)
router.delete('/:id', protect, deleteEmployee);
// router.put('/',);

module.exports = router;
    