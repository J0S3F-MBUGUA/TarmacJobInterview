/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
const mongoose=require('mongoose');

const mongoUrl="mongodb://localhost:27017/TarmacInterview";

const initiateMongoServer=async ()=>{
    try{
        await mongoose.connect(mongoUrl,{useNewUrlParser: true ,useUnifiedTopology: true, useFindAndModify: false});
        console.log("connected to mongodb://localhost:27017/TarmacInterview database");
    }catch(e){
        console.error("ERROR "+e);
    }
};

module.exports = initiateMongoServer;

