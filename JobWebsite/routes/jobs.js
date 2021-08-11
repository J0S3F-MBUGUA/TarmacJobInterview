const express = require('express')
const router = express.Router()
const jobs = require('../model/Jobs');
var url = require('url');
const { query } = require('express');

router.get("/displayAllJobs", async (req, res) => {
    try {
        let Jobs = await jobs.find({});
        res.send(Jobs);
    } catch (e) {
        console.error(e);
        res.status(500).send("Server Error");
    }
}
)

router.get("/fullSearch", async (req, res) => {
    var q = url.parse(req.url, true)
    var data = q.query;
    var jobFunction = data.jobFunction
    var industryType = data.industry
    var location = data.location
    if (jobFunction && industryType && location) {
        let Jobs = await jobs.find({jobFunction , industryType , location});
        res.send(Jobs)
        return
    } else if (jobFunction && industryType) {
        let Jobs = await jobs.find({jobFunction , industryType });
        res.send(Jobs)
        return
    } else if (industryType && location) {
        let Jobs = await jobs.find({ industryType , location});
        res.send(Jobs)
        return
    } else if (jobFunction && location) {
        let Jobs = await jobs.find({jobFunction , location});
        res.send(Jobs)
        return
    } else if (jobFunction) {
        let Jobs = await jobs.find({jobFunction});
        res.send(Jobs)
        return
    } else if (location) {
        let Jobs = await jobs.find({location});
        res.send(Jobs)
        return
    } else if (industryType) {
        let Jobs = await jobs.find({industryType});
        res.send(Jobs)
        return
    } else {
        res.send('Please input a search')
    }
    jobFunction = industryType = location = ''
})

//partial search
router.get('/partialSearch',async (req,res)=>{
    var q = url.parse(req.url, true).query.search
     if(q)
    {
        var result = await jobs.find({jobTitle : {$regex: new RegExp(q)}}).limit(15)
        res.send(result)
    } 
})

module.exports = router;