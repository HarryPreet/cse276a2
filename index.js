const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

const { Pool } = require('pg');
const { response } = require('express');
const { count } = require('console');

var pool;

pool = new Pool({
  connectionString: process.env.DATABASE_URL
})

var app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.get('/', (req, res) => res.render('pages/index'))
app.listen(PORT, () => console.log(`Listening on ${PORT}`))


app.get('/database', (req, res) => {
  var getUsersQuery = 'SELECT * FROM person';
  pool.query(getUsersQuery, (error, result) => {
    if (error)
      res.end(error)
    var results = { 'rows': result.rows }
    res.render('pages/db', results)
  })
})

app.post('/addperson', (req, res) => {
  var pname = req.body.name;
  var size = req.body.size;
  var height = req.body.height;
  var type = req.body.type;
  var insertUsersQuery = `INSERT INTO person values('${pname}',${size},${height},'${type}')`;
 
  pool.query(insertUsersQuery, (error, result) => {
    if (error)
      res.end(error)
    
  })
  var status = 'created';
  var getUsersQuery = 'SELECT * FROM person';
  pool.query(getUsersQuery, (error, result) => {
    if (error)
      res.end(error)
    var results = { 'rows': result.rows }
    res.render('pages/db', results)
  })
  console.log(status)
}) 

app.post('/deleteperson', (req, res) => {
  var pname = req.body.name;
  var insertUsersQuery = `delete from person where person.name= '${pname}'`;
  pool.query(insertUsersQuery, (error, result) => {
    if (error)
      res.end(error)  
  })
  var status = 'deleted';
  console.log(status)
}) 

app.post('/editperson', (req, res) => {
  var pname = req.body.name;
  var size = req.body.size;
  var height = req.body.height;
  var type = req.body.type;
  var insertUsersQuery = `update person set size =${size}, height = ${height}, type ='${type}' where name= '${pname}'`;
  console.log(insertUsersQuery);
  pool.query(insertUsersQuery, (error, result) => {
    if (error)
      res.end(error)  
  })

  var status = 'updated';
  console.log(status)
}) 