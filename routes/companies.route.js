var express = require('express');
const { addCompany, inviteNewEmployeesToJoinCompany } = require('../controllers/companies.controllerr');
var router = express.Router();
const { protect } = require('../middlewares/authMiddleware');

router.post('/', addCompany);
router.get('/linkgenerator', protect, inviteNewEmployeesToJoinCompany);
// router.put('/',);

module.exports = router;