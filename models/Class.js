const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const ClassSchema = new Schema({
  class:{
    type:String,
    required: true
  },
  year:{
    type: Number,
    required: true
  },
  branch: {
    type: String,
    required: true
  },
  batch: {
    type: String,
    required: true
    
  }
});

mongoose.model('classes', ClassSchema);