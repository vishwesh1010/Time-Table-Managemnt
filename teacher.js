
var express = require('express');
const app = express.Router();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const methodOverride = require('method-override');

// Body parser middleware
app.use(bodyParser.urlencoded({ extended:false}))
app.use(bodyParser.json({extended:true}))
app.use(bodyParser.json())

// Map global promise - get rid of warning
mongoose.Promise = global.Promise;


// Method override middleware
app.use(methodOverride('_method'));

// Connect to mongoose
mongoose.connect('mongodb://localhost/time-table')
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

// Load Teacher Model
require('./models/Teacher');
const Teacher = mongoose.model('teachers');


// Teacher Index Page
app.get('/', (req, res) => {
  Teacher.find({})
    .then(teachers => {
      res.render('teachers/index', {
        teachers:teachers
      });
    });
});

// Add Teacher Form
app.get('/add', (req, res) => {
  console.log('hello');
  res.render('teachers/add');
});

// Edit Teacher Form
app.get('/edit/:id', (req, res) => {
  Teacher.findOne({
    _id: req.params.id
  })
  .then(teachers => {
    res.render('teachers/edit', {
      teachers:teachers
    });
  });
});

// Edit Form process
app.put('/:id', (req, res) => {
  Teacher.findOne({
    _id: req.params.id
  })
  .then(teachers => {
    // new values
    teachers.tname = req.body.tname;
    teachers.tcode = req.body.tcode;
    teachers.scode = req.body.scode;
    teachers.save()
      .then(teachers => {
        res.redirect('/teachers');
      })
  });
});

// Process Form
app.post('/', (req, res) => {
  let errors = [];
  console.log(req.body)
  if(!req.body.tname){
    errors.push({text:'Please add teacher name'});
    
  }
  if(!req.body.tcode){
    errors.push({text:'Please add teacher code'});
  }
  if(!req.body.scode){
    errors.push({text:'Please add subject code'});
  }
  

  if(errors.length > 0){
    res.render('teachers/add', {
      errors: errors,
      tname: req.body.tname,
      tcode: req.body.tcode,
      scode: req.body.scode,   
    });
  } else {
    const newUser = {
      tname: req.body.tname,
      tcode: req.body.tcode,
      scode:req.body.scode,
    }
    new Teacher(newUser)
      .save()
      .then(teachers => {
        res.redirect('/teachers');
      })
  }
});

// Delete Teacher
app.delete('/:id', (req, res) => {
  Teacher.remove({_id: req.params.id})
    .then(() => {
      res.redirect('/teachers');
    });
});

module.exports = app;
