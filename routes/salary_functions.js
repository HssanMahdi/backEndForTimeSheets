var express = require('express');
var Salary=  require('../models/Salary');
var Holiady=  require('../models/Holidays');
var Employee=  require('../models/Employee');
const Holiday = require("../models/Holidays");
const Overtime = require("../models/Overtime");
const SalaryModel = require("../models/Salary");
function check_rest_day(){
    var today = new Date();
    return (today.getDay() == 6 || today.getDay() == 0);
}
async function check_holiday(){
    var today = new Date();
    var isHoliday=false;
  await Holiday.find({}).then((holidays)=>{
      holidays.map((h)=>{
         var holDate=new Date(h.holidayDate);
          if(today.getDay()==holDate.getDay() && today.getMonth()==holDate.getMonth() && today.getFullYear()==holDate.getFullYear())
          { isHoliday=true}
           }
      )
  })

    return isHoliday;
}
async function GetOvertime(){
    var overtimeType="Normal day";
    var Rate=0;
    if (await check_holiday()) {overtimeType="Public holiday"}
    if (check_rest_day()) {overtimeType="Rest day"}

    await Overtime.find({}).then((ov)=>{
        ov.map((o)=>{
            if(o.name==overtimeType){
                Rate=o.hourlyRate;
            }

            }
        )
    })

    return Rate;
}
async function GetCompanyWorkingHours(){
    var overtimeType="Normal day";
    var Hours=1;
    if (await check_holiday()) {overtimeType="Public holiday"}
    if (await check_rest_day()) {overtimeType="Rest day"}

    await Overtime.find({}).then((ov)=>{
        ov.map((o)=>{
                if(o.name==overtimeType){
                   Hours=o.working_hours_per_day;


                }

            }
        )
    })

return Hours;
}
async function getOldSalary(salary_id)
{   var old_salary;
    await SalaryModel.findById(salary_id).then((sal)=> {
        old_salary= sal.totalSalary ;
    });
    return old_salary;
}
async function updateSalarys(salary_id,totalSalary,employ_id,ovt){

    sal=new SalaryModel({
        _id:salary_id,
        totalSalary:totalSalary,
        employees:[employ_id],

    })

await SalaryModel.findByIdAndUpdate(salary_id,{_id:salary_id,
    totalSalary:totalSalary, employees:[employ_id],$inc: {  overtime:ovt}} , { useFindAndModify: false });
}

async function calculate_Salary(id_emp){
    var todaysWorkedHours;
    var Salary ;
    var hourPrice;
    var overtimeHours;
    var company_working_hours;
    var ovRate;
    var salary_id;
    company_working_hours= await GetCompanyWorkingHours();
    var old_salary;
    var employ_id;
ovRate= await GetOvertime();
    await Employee.findById(id_emp).then((emp)=> {
        todaysWorkedHours= emp.todaysWorkedHours;
        hourPrice=emp.hourPrice;
        if (todaysWorkedHours > company_working_hours) {
            overtimeHours = (todaysWorkedHours - company_working_hours);
        } else {overtimeHours=0};
     salary_id=emp.salary;
     employ_id=emp._id;

    });
    old_salary= await getOldSalary(salary_id);
    if(overtimeHours>0){ Salary =(((todaysWorkedHours-overtimeHours)*hourPrice)+(overtimeHours*hourPrice*ovRate));}
    else { Salary =(todaysWorkedHours*hourPrice);}

    await updateSalarys(salary_id,((Salary+old_salary)/60),employ_id,overtimeHours);
console.log("Salary: "+old_salary)
}

async function calculate_Salary_For_All_Employees(){
    var employees=[];
    await Employee.find({}).then((emp)=>{
        emp.map((e)=>{
if(e.salary.length!==0) {
    employees.push(e._id)

}
            }
        )
    });
    const iterator = employees.values();
    for (const value of iterator) {
     await calculate_Salary(value);

    }
};

var router = express.Router();
/* show all salary. http://localhost:3000/calculSalary/calculateSalary */
router.get('/calculateSalary', async (req, res) => {


await calculate_Salary_For_All_Employees();
    res.send({ message: "salary was calculated." });
})

const calcul_salary={
    calculate_Salary,
    check_rest_day,
    check_holiday,
    GetOvertime,
    GetCompanyWorkingHours,
    updateSalarys,
    getOldSalary,
    calculate_Salary_For_All_Employees,

};

var CronJob=require('cron').CronJob;
var cronJob1 = new CronJob({

    cronTime: '00 59 23 * * * ',
    onTick: function () {
          //Your code that is to be executed on every midnight
         calculate_Salary_For_All_Employees().then(r =>   console.log("salary calculated"));
    },
    start: true,
    runOnInit: false
});


module.exports=router;
