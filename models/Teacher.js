const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const TeacherSchema = new Schema({
  tname:{
    type:String,
    required: true
  },
  scode:{
    type: Schema.Types.Mixed,
    required: true
  },
  tcode:{
    type: Schema.Types.Mixed,
    required: true
  }
});

mongoose.model('teachers',TeacherSchema);