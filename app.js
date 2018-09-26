const express = require('express');
const exphbs  = require('express-handlebars');
const app = express();
var classes = require('./class.js');
app.use('/classes',classes);
const subjects = require('./subject.js');
app.use('/subjects',subjects);
const teachers = require('./teacher.js');

app.use('/teachers',teachers);
// Handlebars Middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Index Route
app.get('/', (req, res) => {
  const title = 'Welcome';
  res.render('index', {
    title: title
  });
});

// About Route
app.get('/about', (req, res) => {
  res.render('about');
});
const port = 5000;

app.listen(port, () =>{
  console.log(`Server started on port ${port}`);
});