
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

// Load Subject Model
require('./models/Subject');
const Subject = mongoose.model('subjects');


// Subject Index Page
app.get('/', (req, res) => {
  Subject.find({})
    .then(subjects => {
      res.render('subjects/index', {
        subjects:subjects
      });
    });
});

// Add Subject Form
app.get('/add', (req, res) => {
  console.log('hello');
  res.render('subjects/add');
});

// Edit Subject Form
app.get('/edit/:id', (req, res) => {
  Subject.findOne({
    _id: req.params.id
  })
  .then(subjects => {
    res.render('subjects/edit', {
      subjects:subjects
    });
  });
});

// Edit Form process
app.put('/:id', (req, res) => {
  Subject.findOne({
    _id: req.params.id
  })
  .then(subjects => {
    // new values
    subjects.sname = req.body.sname;
    subjects.scode = req.body.scode;
    subjects.semester =req.body.semester;
    
    subjects.save()
      .then(subjects => {
        res.redirect('/subjects');
      })
  });
});

// Process Form
app.post('/', (req, res) => {
  let errors = [];
  console.log(req.body)
  if(!req.body.sname){
    errors.push({text:'Please add subject name'});
    
  }
  if(!req.body.scode){
    errors.push({text:'Please add subject code'});
  }
  if(!req.body.semester){
    errors.push({text:'Please add semester'});
  }

  if(errors.length > 0){
    res.render('subjects/add', {
      errors: errors,
      sname: req.body.sname,
      scode: req.body.scode,
      semester:req.body.semester,
      
    });
  } else {
    const newUser = {
      sname: req.body.sname,
      scode: req.body.scode,
      semester:req.body.semester,
    }
    new Subject(newUser)
      .save()
      .then(subjects => {
        res.redirect('/subjects');
      })
  }
});

// Delete Subject
app.delete('/:id', (req, res) => {
  Subject.remove({_id: req.params.id})
    .then(() => {
      res.redirect('/subjects');
    });
});

module.exports = app;
