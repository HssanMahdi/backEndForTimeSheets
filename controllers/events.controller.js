const employees = require("../models/Employee");
const Events = require("../models/Event");
const tasks = require("../models/Task");

const AddEvent = async (req, res) => {
  try {
    await Events.create(req.body);
    res.status(201).json({ message: "Event added with success" });
  } catch (error) {
    console.log(error.message);
  }
};
// const AddEmployeToEvent = async (req, res) => {
//     const { errors, isValid } = validateEvent(req.body);
//     var startDateSelected = new Date();
//     //   if (!isValid) {
//     //     res.status(404).json(errors);
//     //   } else {
//     //     if (req.body.endDate <= req.body.startDate) {
//     //       throw new Error("endDate must be after startDate");
//     //     } else {
//     //       await Events.findOne({
//     //         startDate: req.body.startDate,
//     //         endDate: req.body.endDate,
//     //       }).then(async (exist) => {
//     //         if (exist) {
//     //           errors.startDate = "there is an event already booked";
//     //           errors.endDate = "the event is still ongoing...";
//     //           res.status(404).json(errors);
//     //         } else {
//     //         //   await Events.create(req.body);
//     //           res.status(201).json({ message: "Event added with success" });
//     //         }
//     //       });
//     //     }
//     //   }

//         var t=new Events({
//          eventName: req.body.eventName,
//         startDate:req.body.startDate,
//         endDate:req.body.endDate,
//         eventDescription:req.body.eventDescription
//        })
//        const event=req.body
//        await Event.create(event)
//        try {
//          const newEvent = await t.save()
//          const employee = Employees.findById(req.params.id)
//          employee.Events.push(newEvent)
//           employee.save()

//          res.status(201).json(newEvent)
//        } catch (err) {
//          res.status(400).json({ message: err.message })
//        }
//   };

const AddEmployeTaskToEvent = async (req, res) => {
  const employee = await employees
    .findById(req.params.id)
    .then((employee) => {
      for (let i = 0; i < employee.tasks.length; i++) {
        tasks
          .findById(employee.tasks[i])
          .then((task) => {
            var event = new Events({
              eventName: task.taskName,
              startDate: task.startDate,
              endDate: task.endDate,
              eventDescription: task.description,
            }).save();
          })
          .catch((err) => {
            res.status(500).send({ message: err.message });
          });
      }
      res.send("added");
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

const FindAllEvents = async (req, res) => {
  try {
    const data = await Events.find();
    res.status(201).json(data);
  } catch (error) {
    console.log(error.message);
  }
};

const FindSinglEvent = async (req, res) => {
  try {
    const data = await Events.findOne({ startDate: req.params.startDate });
    res.status(201).json(data);
  } catch (error) {
    console.log(error.message);
  }
};

const UpdateEvent = async (req, res) => {
  const { errors, isValid } = validateEvent(req.body);
  try {
    if (!isValid) {
      res.status(404).json(errors);
    } else {
      const data = await Events.findOneAndUpdate(
        { _id: req.params.id },
        req.body,
        { new: true }
      );
      res.status(201).json(data);
    }
  } catch (error) {
    console.log(error.message);
  }
};

const DeleteEvent = async (req, res) => {
  try {
    await Events.findOneAndRemove({ _id: req.params.id });
    res.status(201).json({ message: "Event deleted with success" });
  } catch (error) {
    console.log(error.message);
  }
};
const AddEmployee = async (req, res) => {
  try {
    await employees.create(req.body);
    res.status(201).json({ message: "Employee added with success" });
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  AddEvent,
  FindAllEvents,
  FindSinglEvent,
  UpdateEvent,
  DeleteEvent,
  AddEmployeTaskToEvent,
  AddEmployee,
};
