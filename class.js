
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

// Load Class Model
require('./models/Class');
const Class = mongoose.model('classes');


// Class Index Page
app.get('/', (req, res) => {
  Class.find({})
    .then(classes => {
      res.render('classes/index', {
        classes:classes
      });
    });
});

// Add Class Form
app.get('/add', (req, res) => {
  console.log('hello');
  res.render('classes/add');
});

// Edit Class Form
app.get('/edit/:id', (req, res) => {
  Class.findOne({
    _id: req.params.id
  })
  .then(classes => {
    res.render('classes/edit', {
      classes:classes
    });
  });
});

// Edit Form process
app.put('/:id', (req, res) => {
  Class.findOne({
    _id: req.params.id
  })
  .then(classes => {
    // new values
    classes.class = req.body.class;
    classes.year = req.body.year;
    classes.branch =req.body.branch;
    classes.batch=req.body.batch;

    classes.save()
      .then(classes => {
        res.redirect('/classes');
      })
  });
});

// Process Form
app.post('/', (req, res) => {
  let errors = [];
  console.log(req.body)
  if(!req.body.class){
    errors.push({text:'Please add day'});
    
  }
  if(!req.body.year){
    errors.push({text:'Please add class'});
  }
  if(!req.body.branch){
    errors.push({text:'Please add type'});
  }
  if(!req.body.batch){
    errors.push({text:'Please add batch'});
  }



  if(errors.length > 0){
    res.render('classes/add', {
      errors: errors,
      class: req.body.class,
      year: req.body.year,
      branch:req.body.branch,
      batch:req.body.batch
    });
  } else {
    console.log(req.body.class)
    const newUser = {
      class: req.body.class,
      year: req.body.year,
      branch:req.body.branch,
      batch:req.body.batch
    }
    new Class(newUser)
      .save()
      .then(classes => {
        res.redirect('/classes');
      })
  }
});

// Delete Class
app.delete('/:id', (req, res) => {
  Class.remove({_id: req.params.id})
    .then(() => {
      res.redirect('/classes');
    });
});

module.exports = app;
