const usersRouter = require("express").Router();
const pool = require("../db");

const passport = require('passport')
const bcrypt = require('bcrypt')

var results;
usersRouter.post('/login', (req,res)=>{
    username = req.body.username
    password = req.body.password

    var getCredentials = 'select * from credentials where username='+results

pool.query(getCredentials,(error,result)=>{
    if(error){
        res.send(error)
    }
    else{
        
    }
        
})
})


const initializePassport = require('./InitializePassport');
const res = require("express/lib/response");
initializePassport(passport,results) 



usersRouter.post("/", (req, res) => {});

module.exports = usersRouter;
