const express = require('express');
const { AddEvent, FindAllEvents, FindSinglEvent, UpdateEvent, DeleteEvent , AddEmployeTaskToEvent} = require('../controllers/events.controller');
const router = express.Router();


/* add event*/
router.post('/events', AddEvent)

/* add employeTask to event*/
 router.post('/EmployeTasktoevent/:id', AddEmployeTaskToEvent)

/* find all events*/
router.get('/events', FindAllEvents)

/* find an event*/
router.get('/events/:startDate', FindSinglEvent)

/* update event*/
router.put('/events/:id', UpdateEvent)

/* delete event*/
router.delete('/events/:id', DeleteEvent)

module.exports = router;