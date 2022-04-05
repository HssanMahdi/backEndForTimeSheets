var Task = require('../models/Task')
var Employee = require('../models/Employee');
var express = require('express');
const Project = require('../models/Project');
const { route } = require('express/lib/application');
const req = require('express/lib/request');
const router = express.Router();

// Getting all projects
router.get('/', async (req, res) => {
    try {
        const projects = await Project.find()
        for (i = 0; i < projects.length; i++) {
            const leader = Employee.findById(projects.projectLeader)
            //  projects.projectLeader[i]=leader
            console.log(leader)
        }
        res.json(projects)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// Getting one project getProject
router.get('/:id', async (req, res) => {

    try {
        const project = await Project.findById(req.params.id)
        let tab = []
        let tabEmp = []
        for (i = 0; i < project.tasks.length; i++) {
            const t = await Task.findById(project.tasks[i])
            if (t.employee != null) {
                t.employee = await Employee.findById(t.employee)
            }
            tab[i] = t
        }
        project.tasks = tab;
        const leader = await Employee.findById(project.projectLeader)
        project.projectLeader = leader
        for (i = 0; i < project.employees.length; i++) {
            const p = await Employee.findById(project.employees[i])
            tabEmp[i] = p
        }
        res.json({ project, tabEmp })
        // console.log(project)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// creating project
router.post('/', async (req, res) => {
    var p = new Project({
        projectName: req.body.projectName,
        description: req.body.description,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        technologies: req.body.technologies,

    })
    try {
        console.log(req.body)
        const newProject = await p.save()
        res.status(201).json(newProject)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

// Updating project
router.patch('/:id', getProject, async (req, res) => {
    if (req.body.projectName != null) {
        res.project.projectName = req.body.projectName
    }
    if (req.body.description != null) {
        res.project.description = req.body.description
    }
    if (req.body.startDate != null) {
        res.project.startDate = req.body.startDate
    }
    if (req.body.endDate != null) {
        res.project.endDate = req.body.endDate
    }
    if (req.body.technologies != null) {
        res.project.technologies = req.body.technologies
    }
    if (req.body.employees != null) {
        res.project.employees = req.body.employees
    }
    if (req.body.projectLeader != null) {
        res.project.projectLeader = req.body.projectLeader
    }
    try {
        const updatedProject = await res.project.save()
        res.json(updatedProject)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

// Deleting project
router.delete('/:id', getProject, async (req, res) => {
    try {
        await res.project.remove()
        res.json({ message: 'Deleted project' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})


// add task and assign task to project
router.post('/addTask/:id', getProject, async (req, res) => {
    var t = new Task({
        taskName: req.body.taskName,
        description: req.body.description,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        taskType: req.body.taskType,
        project: req.params.id,
        employee: req.body.employee
    })
    try {
        const newTask = await t.save()
        res.project.tasks.push(newTask)
        res.project.save()

        res.status(201).json(newTask)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

//update task
router.put('/updateTask/:id', function (req, res, next) {
    Task.findByIdAndUpdate(req.params.id, req.body, function (err, docs) {
        if (err)
            console.log(err);
        res.send("task updated");
    });
});

//delete task from project
router.delete('/deleteTask/:id', async (req, res, next) => {
    const id = req.params.id
    const task = await Task.findById(id);
    const project = task.project;
    const employee = task.employee
    Project.findOneAndUpdate({ project }, { $pull: { tasks: id } }).then(project => {
        res.json(project);
    }).catch(err => {
        res.status(500).send({ message: err.message })
    })
    if (task.employee != null) {
        Employee.findOneAndUpdate({ employee }, { $pull: { tasks: id } }).catch(err => {
            res.status(500).send({ message: err.message })
        })
    }
    try {
        task.remove();
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
})

//get project tasks
router.get('/getProjectTasks/:id', async (req, res) => {
    const tab = []
    const id = req.params.id
    try {
        const project = await Project.findById(id)

        for (i = 0; i < project.tasks.length; i++) {
            //const t =project.tasks[i]
            const t = await Task.findById(project.tasks[i])
            if (t.employee != null) {
                t.employee = await Employee.findById(t.employee)
            }
            // console.log(t.employee)
            tab.push(t)
        }
        res.json(tab)
    }
    catch (err) {
        res.status(500).json({ message: err.message })
    }
})


// assign employee to project 
router.put('/assignEmployeeToProject/:id', getProject, async (req, res) => {
    const id = req.params.id
    //   let tab=[]
    console.log(id)
    try {
        if (req.body.employees != null) {
            for (i = 0; i < req.body.employees.length; i++) {
                res.project.employees.push(req.body.employees[i])
            }
        }
        const updatedProject = await res.project.save()
        console.log(updatedProject)
        for (i = 0; i < res.project.employees.length; i++) {
            //const y = res.project.employees[i]
            //console.log("hhhhhhhhhhh  " + y)
            const emp = await Employee.findByIdAndUpdate({ _id: res.project.employees[i] }, { $push: { projects: req.params.id } }).exec()
            //emp.save()
        }
        res.json(updatedProject)
    }
    catch (err) {
        res.status(400).json({ message: err.message })
    }

})

//get project employees
router.get('/getProjectEmployees/:id', async (req, res) => {
    const tab = []
    const id = req.params.id
    const project = await Project.findById(id)
    try {
        for (i = 0; i < project.employees.length; i++) {
            const t = await Employee.findById(project.employees[i])
            tab.push(t)
        }
        res.json(tab)
    }

    catch (err) {
        res.status(500).json({ message: err.message })
    }
})

//get employees according to skills
router.get('/getEmployeesAccordingToSkills/:id', getProject, async (req, res) => {
    const technologies = res.project.technologies
    const chosenEmployees = []
    try {
        const employees = await Employee.find()
        for (i = 0; i < employees.length; i++) {
            for (j = 0; j < employees[i].skills.length; j++) {
                for (k = 0; k < technologies.length; k++) {
                    if (technologies[k] == employees[i].skills[j]) {
                        chosenEmployees.push(employees[i])
                    }
                }
            }
        }
        res.json(chosenEmployees)

    }
    catch (err) {
        res.status(400).json({ message: err.message })
    }
})


//assign employee to task
router.put('/assignEmployeeToTask/:id', async (req, res) => {
    const task = await Task.findById(req.params.id)
    const id = req.params.id
    console.log(task)
    console.log(task.employee)
    if (req.body.employee != null) {
        task.employee = req.body.employee
    }
    try {
        const t = await task.save();
        const emp = task.employee
        Employee.findByIdAndUpdate({ _id: emp }, { $push: { tasks: id } }).then(employee => {
            console.log(employee);
        })
        res.json(task)
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
})
//get task employee
router.get('/getTaskEmploye/:id', async (req, res) => {
    const tab = []
    const id = req.params.id
    const project = await Project.findById(id)
    try {
        for (i = 0; i < project.employees.length; i++) {
            const t = await Employee.findById(project.employees[i])
            tab.push(t)
        }
        res.json(tab)
    }

    catch (err) {
        res.status(500).json({ message: err.message })
    }
})

//get task by id with employee
router.get('getTask/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
        const emp = Employee.findById(task.employee)
        task.employee = emp
        res.json(task)
        // console.log(project)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})
//delete employee from task
router.delete('/deleteEmployeeFromTask/:id', async (req, res) => {
    const id = req.params.id
    console.log(id)
    try {
        const t = await Task.findById(id);
        const emp = t.employee
        console.log("emp" + emp)
        Employee.findByIdAndUpdate({ _id: emp }, { $pull: { tasks: id } }).then(employee => {
            console.log(employee);
        })
        Task.findByIdAndUpdate({ _id: id }, { $unset: { employee: emp } }).then(task => {
            console.log(task);
        })
        res.json("deleted")
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
})

//delete employee from project


async function getProject(req, res, next) {
    let p
    try {
        p = await Project.findById(req.params.id)
        if (p == null) {
            return res.status(404).json({ message: 'Cannot find project' })
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
    res.project = p
    next()
}



module.exports = router
