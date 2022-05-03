var Task = require('../models/Task')
// var CV = require('../models/CV')
var Employee = require('../models/Employee');
var express = require('express');
const Project = require('../models/Project');
const { route } = require('express/lib/application');
const req = require('express/lib/request');
const { findById } = require('../models/Task');
const workedProject = require('../models/WorkedProjects');
const router = express.Router();

//calculate projects progress
router.put('/updateProgress', async (req, res) => {
    var prog=0
    var done = 0

    try {
        const projects = await Project.find().populate('tasks');
        for (i = 0; i < projects.length; i++) {
            console.log("progressInitial",(projects[i].progress))
            for (j = 0; j < projects[i].tasks.length; j++) {
                console.log("taskk",projects[i].tasks[j])
                if (projects[i].tasks[j].taskType === 'done') {
                    done += 1
                }
                prog  =((Math.round((done*100)/(projects[i].tasks.length)))%10)*10
                console.log("progress",prog)
                const proj = await Project.findByIdAndUpdate({ _id: projects[i]._id }, { $set: { progress: prog } }).exec()
            }
            done=0
                //console.log("progress",(projects[i].progress))
        }
        res.json({ projects})
    }
    catch (err) {
        res.status(500).json({ message: err.message })
    }
})

//get all employees
router.get('/allEmployees', async (req, res) => {
    try {
        const employees = await Employee.find();
        res.json(employees)
        //console.log(employees)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})
// Getting all projects
router.get('/', async (req, res) => {
    let inProgress = []
    let upcoming = []
    let finished = []
    var done = 0
    var doing = 0
    var todo = 0
    try {
        const projects = await Project.find().populate('tasks');
       
        for (i = 0; i < projects.length; i++) {
            //console.log("progress",projects[i].progress)
            if (projects[i].projectLeader != null) {
                const leader = await Employee.findById(projects[i].projectLeader)
                projects[i].projectLeader = leader
            }
            for (j = 0; j < projects[i].tasks.length; j++) {
                 if (projects[i].tasks[j].taskType === 'doing') {
                    doing += 1
                }
                //console.log(projects[i].tasks[j].taskType)
                if (projects[i].tasks[j].taskType === 'todo') {
                    todo += 1
                }
                if (projects[i].tasks[j].taskType === 'done') {
                    done += 1
                }
             
            }
                console.log("progress",projects[i]._id,projects[i].progress)
            // console.log('todo '+todo)
            // console.log('done '+done)
            // console.log('doing '+doing)
            if (doing > 0 ) {
                inProgress.push(projects[i])
            } else if (projects[i].tasks.length == done && done > 0) {
                finished.push(projects[i])
            } else {
                upcoming.push(projects[i])
            }
            
            done = 0
            doing = 0
            todo = 0
     }
        let inProgressFinal = [...new Set(inProgress)]
        let finishedFinal = [...new Set(finished)]
        let upcomingFinal = [...new Set(upcoming)]
        // console.log('inProgressFinal '+inProgressFinal.length)
        // console.log('finishedFinal '+finishedFinal.length)
        // console.log('upcomingFinal '+upcomingFinal.length)
        res.json({ projects, inProgressFinal, upcomingFinal, finishedFinal })
        //console.log("inProgress",inProgressFinal,finishedFinal,upcomingFinal)   
    }
    catch (err) {
        res.status(500).json({ message: err.message })
    }
})

//get all employees
router.get('/allEmployees', async (req, res) => {
    try {
        const employees = await Employee.find();
        res.json(employees)
        //console.log(employees)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

//get all employees sauf projectEmployees
router.get('/allEmployeesForProject/:id', async (req, res) => {
    const idProject = req.params.id
    let tab = []
    try {
        const project = await Project.findById(idProject)
        console.log('projectttt', project)
        const projectEmployees = project.employees
        const allEmployees = await Employee.find()

        console.log("allEmployees ", allEmployees.length)
        for (let i = 0; i < allEmployees.length; i++) {
            for (let j = 0; j < projectEmployees.length; j++) {
                console.log('allEmployees[i]._id ', allEmployees[i]._id)
                console.log('projectEmployees[i] ', projectEmployees[j])
                console.log('if', allEmployees[i]._id.toString() !== projectEmployees[j].toString())
                console.log('----------------')
                if (allEmployees[i]._id.toString() !== projectEmployees[j].toString()) {
                    tab.push(allEmployees[i])
                }
            }
        }
        let tabFinal = [...new Set(tab)]

        console.log("taaaab ", tabFinal.length)
        res.json(tabFinal)
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
            console.log(t.employee)

            if (t.employee != null) {
                const emp = await Employee.findById(t.employee)
                t.employee = emp
                console.log(t.employee)
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
        project.employees = tabEmp
        res.json(project)
        //  console.log(tabEmp)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})
//get one employee
router.get('/:id', async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id)
        
        for (i = 0; i < project.tasks.length; i++) {
            const t = await Task.findById(project.tasks[i])
            console.log(t.employee)

            if (t.employee != null) {
                const emp = await Employee.findById(t.employee)
                t.employee = emp
                console.log(t.employee)
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
        project.employees = tabEmp
        res.json(project)
        //  console.log(tabEmp)
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
        progress: req.body.progress
    })
    try {
        // console.log(req.body)
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

//add worked project to employee

router.post('/addWorkProjects/:id', async (req, res) => {
    var p = new workedProjects({
        name: req.body.name,
        description: req.body.description,
        technologies: req.body.technologies,
        employee: req.params.id
    })
    try {
        const newproject = await p.save()
        emp = await Employee.findById(req.params.id)
        emp.workedProjects.push(newproject)
        emp.save()
        res.status(201).json(newproject)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})
//update task
router.patch('/updateTask/:id', async (req, res) => {
    const t = await Task.findById(req.params.id)
    if (req.body.taskName != null) {
        t.taskName = req.body.taskName
    }
    if (req.body.description != null) {
        t.description = req.body.description
    }
    if (req.body.startDate != null) {
        t.startDate = req.body.startDate
    }
    if (req.body.endDate != null) {
        t.endDate = req.body.endDate
    }
    try {
        const updatedtask = await t.save()
        res.json(updatedtask)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
});

//update emp
router.put('/updateEmp/:id', async (req, res) => {
    const e = await Employee.findById(req.params.id)
    if (req.body.skills != null) {
        e.skills = req.body.skills
    }
    if (req.body.projectsWorked != null) {
        e.projectsWorked = req.body.projectsWorked
    }
    try {
        const updatedEmp = await e.save()
        res.json(updatedEmp)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
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


// assign employees to project 
router.put('/assignEmployeesToProject/:id', getProject, async (req, res) => {
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
            
            const emp = await Employee.findByIdAndUpdate({ _id: res.project.employees[i] }, { $push: { projects: req.params.id } }).exec()
            
        }
        res.json(updatedProject)
    }
    catch (err) {
        res.status(400).json({ message: err.message })
    }
})
//assign employee to project
router.put('/assignEmployeeToProject/:id/:idEmp', async (req, res) => {
    const idProj = req.params.id
    const idEmp = req.params.idEmp
    try {
        const project = await Project.findById(idProj)
        //console.log(project)
        project.employees.push(idEmp)
        const updatedProject = await project.save()
        const emp = await Employee.findByIdAndUpdate({ _id: idEmp }, { $push: { projects: idProj } }).exec()
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
            const emp = await Employee.findById(project.employees[i])
            tab.push(emp)
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
    var empProjects = []
    const chosenEmployeesSkill = []
    const workedProjectFinal = []
    try {
        const employees = await Employee.find()
        for (i = 0; i < employees.length; i++) {
            for (j = 0; j < employees[i].skills.length; j++) {
                for (k = 0; k < technologies.length; k++) {
                    if (technologies[k] == employees[i].skills[j]) {
                        chosenEmployeesSkill.push(employees[i])
                    }
                }
            }
        }
        for (i = 0; i < employees.length; i++) {
            empProjects = employees[i].workedProjects
            console.log("employees[i].workedProjects", employees[i].workedProjects)
            for (h = 0; h < empProjects.length; h++) {
                var oneWorkedProject = await workedProject.findById(empProjects[h])
                for (k = 0; k < technologies.length; k++) {
                    for (l = 0; l < oneWorkedProject.technologies.length; l++) {
                        if (oneWorkedProject.technologies[l] == technologies[k]) {
                            workedProjectFinal.push(employees[i])
                        }
                    }
                }
            }
        }

        //      let maxRating=employees[0]
        //    for (i = 0; i < employees.length; i++) {
        //     console.log(employees[i].rating)
        //     console.log(employees[i].rating+1)
        //     console.log("numm",employees[i].rating>1)
        // if((employees[i]+1)!=undefined || (employees[i]+1)!=NaN ){
        //     if (employees[i].rating>(employees[i]+1).rating){
        //         maxRating=employees[i]
        //        //  console.log(employees[i].rating>(employees[i]+1).rating)
        //       }
        // } }
        //    console.log("maxr",maxRating)
        let workedProjects = [...new Set(workedProjectFinal)]
        let chosenEmployeesSkills = [...new Set(chosenEmployeesSkill)]
        res.json({ chosenEmployeesSkills, workedProjects })
    }
    catch (err) {
        res.status(400).json({ message: err.message })
    }
})


//assign employee to task
router.put('/assignEmployeeToTask/:id/:idEmp', async (req, res) => {
    const task = await Task.findById(req.params.id)
    const id = req.params.id
    //console.log("body",req.params.idEmp)
    task.employee = req.params.idEmp
    try {
        const t = await task.save();
        const emp = task.employee
        Employee.findByIdAndUpdate({ _id: emp }, { $push: { tasks: id } }).then(employee => {
            // console.log(employee);
        })
        res.json(task)
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
})
//get task employee
router.get('/getTaskEmployee/:id', async (req, res) => {
    const id = req.params.id
    try {
        const task = await Task.findById(id)
        // console.log(task.employee)
        const emp = await Employee.findById(task.employee)
        task.employee = emp

        res.json(task)
    }

    catch (err) {
        res.status(500).json({ message: err.message })
    }
})

//delete employee from task
router.delete('/deleteEmployeeFromTask/:id', async (req, res) => {
    const id = req.params.id
    // console.log(id)
    try {
        const t = await Task.findById(id);
        const emp = t.employee
        console.log("emp" + emp)
        Employee.findByIdAndUpdate({ _id: emp }, { $pull: { tasks: id } }).then(employee => {
            // console.log(employee);
        })
        Task.findByIdAndUpdate({ _id: id }, { $unset: { employee: emp } }).then(task => {
            // console.log(task);
        })
        res.json("deleted")
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
})
//get employee for project
router.get('/getEmployeeForProject', async (req, res) => {

    try {
        const allEmployees = await Project.find()
        res.json(allEmployees)
    }
    catch (err) {
        res.status(500).json({ message: err.message })
    }
})
//delete employee from project

router.delete('/deleteEmployeeFromProject/:id/:idEmp', async (req, res) => {
    const id = req.params.id
    const idEmp = req.params.idEmp
    try {
        Employee.findByIdAndUpdate({ _id: idEmp }, { $pull: { projects: id } }).then(employee => {
            // console.log(employee);
        })
        Project.findByIdAndUpdate({ _id: id }, { $pull: { employees: idEmp } }).then(project => {
            // console.log(task);
        })
        res.json("deleted")
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
})


//delete project leader from project
router.delete('/deleteProjectLeaderFromProject/:id', async (req, res) => {
    const id = req.params.id
    try {
        const proj = await Project.findById(id)
        const projLeader = proj.projectLeader
        Employee.findByIdAndUpdate({ _id: projLeader }, { $unset: { project: id } }).then(employee => {
            console.log(employee.project);
        })
        Project.findByIdAndUpdate({ _id: id }, { $unset: { projectLeader: projLeader } }).then(project => {
            console.log(project);
        })
        res.json("deleted")
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
})




//Add project leader To project
router.put('/assignProjectLeaderToProject/:idProj/:idEmp', async (req, res) => {
    const idProj = req.params.idProj
    const idEmp = req.params.idEmp

    try {
        Employee.findByIdAndUpdate({ _id: idEmp }, { $set: { project: idProj } }).then(employee => {
        })
        Project.findByIdAndUpdate({ _id: idProj }, { $set: { projectLeader: idEmp } }).then(project => {
        })
        res.json("added")
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
})


//rating employee
router.put('/ratingEmployee/:id', async (req, res) => {
    try {
        const emp = await Employee.findById(req.params.id)
        if (req.body.rating != 0) {
            emp.nbRating = emp.nbRating + 1
            var x = (req.body.rating + emp.rating) / emp.nbRating
            console.log("x", x)
            emp.rating = x
        }
        const updatedEmployee = await emp.save()
        res.json(updatedEmployee.rating)
        console.log("e", updatedEmployee.rating)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
});


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
