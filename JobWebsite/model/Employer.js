/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
const mongoose=require('mongoose');
const Schema=mongoose.Schema

const EmployerSchema = mongoose.Schema({
    orgName : {
        type : String,
        required : true
    },
    username : {
        type : String,
        required : true
    },
    password : {
         type : String,
         required : true
    },
    phoneNo : {
         type : String,
         required : true
    },
    email : {
         type : String,
         required : true
    },
    address : {
         type : String,
         required : true
    },
    website : {
         type : String,
         required : true
    },
    myJobs :[{
         type : Schema.Types.ObjectId,
         ref : 'Jobs'
    }]
});

module.exports = mongoose.model('employer',EmployerSchema,'Employer');

