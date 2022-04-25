const express = require('express');
const { AddEvent, FindAllEvents, FindSinglEvent, UpdateEvent, DeleteEvent , AddEmployeTaskToEvent} = require('../controllers/events.controller');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');


/* add event*/
router.post('/events',protect, AddEvent) 

/* add employeTask to event*/
 router.post('/EmployeTasktoevent/:id', AddEmployeTaskToEvent)

/* find all events*/
router.get('/events', protect ,FindAllEvents)

/* find an event*/
router.get('/events/:id', FindSinglEvent)

/* update event*/
router.put('/events/:id', UpdateEvent)

/* delete event*/
router.delete('/events/:id', DeleteEvent)

module.exports = router;