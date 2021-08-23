let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let session = require('express-session');
let mongoose = require('mongoose');
const {flash} = require('express-flash-message');


// Connection URI - připojení na MongoDB
const uri =
    "mongodb+srv://ekreativAdmin:adminHeslo@cluster0.3xdwp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

// HTTP framework
let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


//use sessions for tracking logins
app.use(session({
    secret: 'supertajnykodkterynikdonezna',
    resave: true,
    saveUninitialized: false,
}));

app.use(flash({sessionKeyName: 'flashMessage'}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname + '/public'));


const {flashMiddleware} = require("./services/flash");

// catch 404 and forward to error handler
app.use(flashMiddleware);

// Nastavení routes a správného načítání

const indexRouter = require('./routes/index');
const courseRouter = require('./routes/course');
const loginRouter = require('./routes/login');
const logoutRouter = require('./routes/logout');

app.use(indexRouter);
app.use(loginRouter);
app.use(logoutRouter);
app.use(courseRouter);

const adminCreatorRouter = require('./routes/admin/creator');

app.use(adminCreatorRouter);



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

mongoose
    .connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    })
    .catch((err) => console.log(err));

module.exports = app;
