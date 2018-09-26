const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const SubjectSchema = new Schema({
  sname:{
    type:String,
    required: true
  },
  scode:{
    type: Schema.Types.Mixed,
    required: true
  },
  semester: {
    type: Number,
    required: true
  }
});

mongoose.model('subjects',SubjectSchema);