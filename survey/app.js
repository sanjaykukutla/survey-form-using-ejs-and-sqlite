const express = require('express');
const path = require('path'); 
var fs = require('fs')
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(':memory:');


const port = 9600;
const app = express();

const staticPath = path.join(__dirname, './public')
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({limit: '50mb', extended: true, parameterLimit: 10000}));

app.use(express.json());
app.use(express.static(staticPath))

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.get('/', (req, res) => {
    res.render('projectform')
})
app.get('/projectform', (req, res) => {
    res.render('projectform')
})

app.get('/projectform', (req, res) => {
    res.render('projectdetails')
})



const db_name = path.join(__dirname,"data","test.db")
db =new sqlite3.Database(db_name,err=>{
    if(err){
        return console.log(err.message)
    }

    console.log('Database connected')
})

const sqltable =`CREATE TABLE IF NOT EXISTS INNOVATION(
    uid INTEGER PRIMARY KEY AUTOINCREMENT,
    Timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    Name VARCHAR(100) NOT NULL,
    Gender VARCHAR(100) NOT NULL,
    Country VARCHAR(100) NOT NULL,
    phasedetails VARCHAR(100) NOT NULL,
    tech VARCHAR(100) NOT NULL
);`;

db.run(sqltable, err=>{
    if(err){
       return console.log(err.message)
    }
    console.log('TABLE CREATED')
})


app.post('/projectdetails', (req, res) => {
    const Name = req.body.Name
    const Gender = req.body.Gender
    const Country = req.body.Country
    const phasedetails = req.body.phasedetails
    const tech = req.body.tech
    
    const query = "Insert into INNOVATION(Name, Gender, Country, phasedetails, tech) values (?,?,?,?,?)"
    const project = [Name, Gender, Country, phasedetails, tech];
    db.run(query, project,err=>{
        if(err){
            console.log(err.message)
        }
        res.redirect('projectdetails')
    })
})

app.get('/projectdetails', (req, res)=>{
     const sql="select * from INNOVATION order by uid desc";
    const sql1 ="SELECT timestamp FROM INNOVATION ORDER BY timestamp ASC"
    db.all(sql,[],(err,rows)=>{
        if(err){
            return console.log(err.message);
        }
        res.render("projectdetails",{model: rows});
    })    
})


app.listen(port, ()=>{
    console.log(`Listening on port ${port}`);
});
