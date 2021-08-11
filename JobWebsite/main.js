/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

const express = require('express');
const bodyParser = require('body-parser');
const { check, validationResult } = require('express-validator');
var url = require('url');
const fs = require('fs');
const InitiateMongoServer = require('./config/db');
const employer = require('./routes/employer');
const jobs = require('./routes/jobs');
const session = require('express-session');


//Initiate mongo server
InitiateMongoServer();

const app = express();
//Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());


const PORT =  4000;

app.use(express.static('public'));

const TWO_HOURS = 1000 * 60 * 60 * 2;

const {
        NODE_ENV = 'development',
        SESS_NAME = 'sid',
        SESS_LIFETIME = TWO_HOURS,
        SESS_SECRET = 'ssh!quiet,it\'asecret!'
} = process.env;

const IN_PROD = NODE_ENV === 'production'

app.use(session({
        name: SESS_NAME,
        resave: false,
        secret: SESS_SECRET,
        cookie: {
                maxAge: SESS_LIFETIME,
                sameSite: true,
                secure: IN_PROD
        }
}));


app.get('/', (req, res) => {
    res.type('html')
    fs.readFile('./public/index.html',(err,data)=>{
        if(err) throw err
        res.send(data)
    })
});

app.get('/CreateJobs', (req, res, next) => {
    res.type('html')
    fs.readFile('./public/CreateJob.html',(err,data)=>{
        if(err) throw err
        res.send(data)
    })
});

app.get('/SubmitJob', (req, res, next) => {
    res.type('html')
    fs.readFile('./public/Submit Job.html',(err,data)=>{
        if(err) throw err
        res.send(data)
    })
});

app.get('/DeleteJobs', (req, res, next) => {
    res.type('html')
    fs.readFile('./public/DeleteJob.html',(err,data)=>{
        if(err) throw err
        res.send(data)
    })
});

app.get('/UpdateJobs', (req, res, next) => {
    res.type('html')
    fs.readFile('./public/UpdateJob.html',(err,data)=>{
        if(err) throw err
        res.send(data)
    })
});

app.get('/afterSubmission', (req, res, next) => {
    res.type('html')
    fs.readFile('./public/AfterJobSubmit.html',(err,data)=>{
        if(err) throw err
        res.send(data)
    })
});

app.get('/afterSignUp', (req, res, next) => {
    res.type('html')
    fs.readFile('./public/AfterSignUp.html',(err,data)=>{
        if(err) throw err
        res.send(data)
    })
});

app.get('/afterCreateJob', (req, res, next) => {
    res.type('html')
    fs.readFile('./public/AfterCreateJob.html',(err,data)=>{
        if(err) throw err
        res.send(data)
    })
});

app.use('/employer',employer)
app.use('/jobs',jobs)


app.listen(PORT, () => {
    console.log("server  started at PORT " + PORT);
});