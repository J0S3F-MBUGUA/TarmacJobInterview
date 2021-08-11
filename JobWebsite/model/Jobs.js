/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
const mongoose=require('mongoose');

const JobSchema = mongoose.Schema({
    jobTitle : {
        type : String,
        required : true
    },
    companyEmploying : {
        type : String,
        required : false
    },
    location : {
         type : String,
         required : false
    },
    jobType : {
         type : String,
         required : false
    },
    saraly : {
         type : String,
         required : false
    },
    jobFunction : {
         type : String,
         required : false
    },
    industryType : {
         type : String,
         required : false
    },
    description : {
         type : String,
         required : false
    },
});

module.exports = mongoose.model('jobs',JobSchema,'Jobs');


