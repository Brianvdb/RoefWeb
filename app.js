var express = require('express');
var exphbs = require('express-handlebars');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var cors = require('cors');

var mysql = require("mysql");

var index = require('./routes/index');
var webLogin = require("./routes/login");

var medewerker = require('./routes/api/medewerker');
var dagstaat = require('./routes/api/dagstaat');
var kenteken = require('./routes/api/kenteken');
var klant = require('./routes/api/klant');
var rol = require('./routes/api/rol');
var wagentype = require('./routes/api/wagentype');
var login = require('./routes/api/login');
var weekstaat = require('./routes/api/weekstaat');

var app = express();

// view engine setup
app.engine('.hbs', exphbs({extname: '.hbs', defaultLayout: 'main'}));
app.set('view engine', '.hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors({origin: '*'}));


app.use('/', index);
app.use('/login', webLogin);
app.use('/api/medewerker', medewerker);
app.use('/api/dagstaat', dagstaat);
app.use('/api/kenteken', kenteken);
app.use('/api/klant', klant);
app.use('/api/rol', rol);
app.use('/api/wagentype', wagentype);
app.use('/api/login', login);
app.use('/api/weekstaat', weekstaat);

app.locals.connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "deroef"
});

app.locals.connection.connect(function(err){
  if(err){
    console.log('Error connecting to Db');
    return;
  }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', {layout: false});
});

module.exports = app;
