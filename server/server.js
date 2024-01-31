const createError = require("http-errors");
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config();
const router = require('./routes/router')

mongoose.set("strictQuery", false);
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(process.env.mongoDB);
}

const app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended:false}));
const cors = require("cors");
const corsOptions ={
  origin: "*",
  credentials: true,
}
app.use(cors(corsOptions))

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api', router)

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.send('error');
});

app.listen(5000, () => console.log('Server is Listening on Port 5000'))

module.exports = app;


