const nodeMailer = require('nodemailer')
const Employee = require("../models/Employee");
const Company = require("../models/Company");
exports.sendMail=(req,res)=>{
    console.log("req body", req.body);
    //const employees = Employee.find().find({_id:{$ne:req.employee._id}}).find({company:{$eq:req.employee.company}});
    let mailEmp=req.body.mailEmp;
    let subject=req.body.subject
    let userMessage=req.body.message;

    let transporter=nodeMailer.createTransport({
        host: "smtp.gmail.com",
        port: 587, //port for secure SMTP
        secure: false,
        requireTLC: true,
        auth: {
            user: "on.time.by.alpha.team@gmail.com",
            pass: "Mahdighadaasmaoumaymaelyes",
        },
    })
    var message = {
        from: 'on.time.by.alpha.team@gmail.com', // sender address
        to: mailEmp, // list of receivers
        subject: subject, // Subject line
        text: userMessage, // plain text body
        html: `<p> Hello ${mailEmp},
        <br></br>
        'This is the link for the shared file' <br></br>
        ${userMessage} <br></br>
        'Please click on it to open.'<br></br>

        'Thanks,'<br></br>
        'Team. '</p>` 
    };

    transporter.sendMail(message,(err,info)=>{
        if(err){
            console.log("error in sending mail",err)
            return res.status(400).json({
                message: `error in sending mail ${err}`
            })
        }else{
            console.log("successfully send the mail",info)
            return res.json({
                message:info
            })
        }
    })
}