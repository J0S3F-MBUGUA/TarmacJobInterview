/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
//const Schema = mongoose.Schema


const ApplicationsSchema = mongoose.Schema({
     selectedJob: {
          type: String,
          required: true
     },
     fname: {
          type: String,
          required: true
     },
     lname: {
          type: String,
          required: true
     },
     email: {
          type: String,
          required: true
     },
     phoneNo: {
          type: String,
          required: true
     },
     gender: {
          type: String,
          required: true
     },
     maritalStatus: {
          type: String,
          required: true
     },
     pAddress: {
          type: String,
          required: true
     },
     file: {
          type: Buffer,
          required: false
     },
     name: {
          type: String,
          required: false
     },
});

module.exports = mongoose.model('applications', ApplicationsSchema, 'Applications');

