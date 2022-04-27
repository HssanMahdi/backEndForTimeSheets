var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const Document = require('./models/Document')
require('dotenv').config();
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to DB !!! && Server running on PORT : " + process.env.PORT))
  .catch(err => console.log(err.message));
  const io = require("socket.io")(3002, {
    cors: {
      origin: "http://localhost:3000",
      path: "/FileEdit",
      methods: ["Get", "Post"],
    },
  });
  const defaultValue = ""
  io.on("connection", socket => {
      socket.on("get-document", async documentId => {
      const document = await findorCreateDocument(documentId)
      socket.join(documentId)
      socket.emit("load-document", document.data)
  
      socket.on("send-message", delta => {
      socket.broadcast.to(documentId).emit("receive-changes", delta);
      });
      socket.on("save-document", async data => {
        await Document.findByIdAndUpdate(documentId, {data})
      })
    });
  });
  
  async function findorCreateDocument(id) {
    if (id == null) return
  
    const document = await Document.findById(id)
    if (document) return document
    return await Document.create({_id: id, data: defaultValue})
  }

var indexRouter = require('./routes/index.router');
var employeeRouter = require('./routes/employees.route');
var companyRouter = require('./routes/companies.route');
var chatRouter = require('./routes/chat.route');
var messageRouter = require('./routes/message.route');
var eventRouter = require('./routes/event.router');
var fileRouter = require('./routes/file.router');
var projectRouter = require('./routes/project');
var cvRouter = require('./routes/cv');


var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname + '/public/videos'));


app.use('/', indexRouter);
app.use('/employee', employeeRouter);
app.use('/company', companyRouter);
app.use('/chat', chatRouter);
app.use('/message', messageRouter);
app.use('/calendar',eventRouter);
app.use('/file',fileRouter.routes);
app.use('/projects', projectRouter);
app.use('/cv', cvRouter);


app.use(notFound);
app.use(errorHandler);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.use(bodyParser.json());
app.use('/uploads',express.static(path.join(__dirname, 'uploads')));
module.exports = app;
