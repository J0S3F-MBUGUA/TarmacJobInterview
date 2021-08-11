/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const formidable = require('formidable');
const fileupload = require('express-fileupload')
const fs = require('fs')
const nodemailer = require('nodemailer')
const employer = require('../model/Employer');
const jobs = require('../model/Jobs');
const applications = require('../model/Applications');
const subscriptions = require('../model/Subscriptions');
const { response } = require('express');
const Jobs = require('../model/Jobs');
const Subscriptions = require('../model/Subscriptions');

const app = express()
app.use(fileupload())
//var binary = mongodb.Binary

//var uploadedJobs = []
var transporter = nodemailer.createTransport({
        service: 'yahoo',
        auth: {
          user: 'joxey78@yahoo.com',
          pass: 'Successf00l;'
        },
        tls: {
                rejectUnauthorized: false
            }
      })

router.post('/SignUp', async (req, res) => {
        try {
                const {
                        orgName,
                        username,
                        password,
                        phoneNo,
                        email,
                        address,
                        website
                } = req.body;

                var Employer = await employer.findOne({ email });

                if (Employer) {
                        res.send("exists");
                } else {
                        Employer = new employer({
                                orgName,
                                username,
                                password,
                                phoneNo,
                                email,
                                website,
                                address
                        });

                        const salt = await bcrypt.genSalt(10);

                        Employer.password = await bcrypt.hash(password, salt)
                        req.session.users = 'wait'

                        var response = await Employer.save()
                        req.session.users = response._id.toString()

                        console.log(req.session.users)

                        res.send("account created")
                }
        } catch (e) {
                console.error(e.message);
                res.status(500).send("Error in saving");

        }

});

router.post("/login", async (req, res) => {

        var { email, password } = req.body;

        try {
                let Employer = await employer.findOne({ email });
                if (!Employer) {
                        res.send("unexistance");
                } else {
                        const isMatch = await bcrypt.compare(password, Employer.password);
                        if (!isMatch) {
                                res.send("incorrect");
                        } else {
                                req.session.users = Employer._id.toString()
                                res.send('logged in')
                        }
                }
        } catch (e) {
                console.error(e);
                res.status(500).send("Server Error");
        }
}
);

router.post('/SubmitJobs', (req, res) => {
        var form = new formidable.IncomingForm();
        form.parse(req, async (err, fields, files) => {
                if (err) return console.log('error ' + err);

                fs.readFile(files.cv.path, async (err, data) => {
                        if (err) return err
                        var Applications = new applications({
                                selectedJob: fields.selectedJob,
                                fname: fields.fname,
                                lname: fields.lname,
                                email: fields.email,
                                phoneNo: fields.phoneNo,
                                gender: fields.gender,
                                maritalStatus: fields.maritalStatus,
                                pAddress: fields.pAddress,
                                file: data,
                                name: files.cv.name
                        });

                        await Applications.save()

                        res.redirect("/afterSubmission")

                        checkSubscription(fields, files)

                })
        })
        /* form.on('fileBegin', (name, file) => {
                 file.path = "C:/Users/joseph/Documents/mixed/put/" + file.name
         })*/
})

var checkSubscription = async (fields, files) => {
        if (fields.subscribe != 'no') {
                var jobType = "", saraly = 10000000000, location = "", industryType = ""
                var Jobs = await jobs.findOne({ _id: fields.selectedJob })
                var criteria=0
                if (fields.JobType != null) {
                        jobType = Jobs.jobType
                        criteria+=1
                }
                if (fields.Location != null) {
                        location = Jobs.location
                        criteria+=1
                }
                if (fields.Industry != null) {
                        industryType = Jobs.industryType
                        criteria+=1
                }
                if (fields.Salary != null) {
                        saraly = Jobs.saraly
                        criteria+=1
                }
                fs.readFile(files.cv.path, async (err, data) => {
                        if(err) console.log(err)
                        var Subscriptions = new subscriptions({
                                selectedJob: fields.selectedJob,
                                fname: fields.fname,
                                lname: fields.lname,
                                email: fields.email,
                                phoneNo: fields.phoneNo,
                                gender: fields.gender,
                                maritalStatus: fields.maritalStatus,
                                pAddress: fields.pAddress,
                                subscribe: fields.subscribe,
                                location: location,
                                jobType: jobType,
                                saraly: saraly,
                                jobFunction: Jobs.jobFunction,
                                industryType: industryType,
                                criteria: criteria,
                                file: data,
                                name: files.cv.name
                        });
                        await Subscriptions.save()
                });

        }
        fs.unlinkSync(files.cv.path);
}

router.post("/desktopLogin", async (req, res) => {

        var { email, password } = req.body;
        try {
                var Employer = await employer.findOne({ email })
                var getPosition = []
                if (!Employer) {
                        res.send("Does not exist");
                } else {
                        const isMatch = await bcrypt.compare(password, Employer.password);
                        if (!isMatch) {
                                res.send("incorrect");
                        } else {
                                var submissions = []
                                // var Applications = await applications.find({},{file:0})
                                var Applications = await applications.find({})


                                for (var i = 0; i < Employer.myJobs.length; i++) {
                                        for (var c = 0; c < Applications.length; c++) {
                                                if (Applications[c].selectedJob == Employer.myJobs[i].toString()) {
                                                        getPosition.push(Applications[c].selectedJob)
                                                        submissions.push(Applications[c])
                                                }
                                        }
                                }
                                // filterFile(submissions)
                                res.json(submissions)
                                //let buffer=submissions[0].file.buffer
                                // fs.writeFileSync('C:\\Users\\joseph\\Documents\\mixed\\put\\myCv.pdf',buffer)
                                //console.log(submissions)
                                popRequested(getPosition)
                        }
                }
        } catch (e) {
                console.error(e);
                res.status(500).send("Server Error");
        }
}
);

//delete selected job that are requested from employer but not subscribed
const popRequested = async (position) => {
        if (position.length != 0) {
                for (var v = position.length - 1; v >= 0; v--) {
                        // uploadedJobs.splice(position[v], 1)
                        await applications.deleteOne({ selectedJob: position[v] })
                }

        }

}

router.post('/CreateJob', async (req, res) => {
        try {
                if (!req.session.users) {
                        res.send('not logged in')
                } else {
                        const {
                                jobTitle,
                                companyEmploying,
                                location,
                                jobType,
                                saraly,
                                jobFunction,
                                industryType,
                                description
                        } = req.body;

                        var Jobs = new jobs({
                                jobTitle,
                                companyEmploying,
                                location,
                                jobType,
                                saraly,
                                jobFunction,
                                industryType,
                                description
                        });

                        var response = await Jobs.save()

                        await employer.findByIdAndUpdate({ _id: req.session.users.toString() }, { $push: { myJobs: response._id.toString() } }, { new: true })
                        res.send("Job Created")
                        checkAvailableSubscriptions(response)
                }
        } catch (e) {
                console.error(e.message);
                res.status(500).send("Error in saving");

        }
        ;
});

//checks for previous subscriptions
var checkAvailableSubscriptions=async (response)=>{ 
        var counter=0
        var Subscription = await subscriptions.find({})
       
        for(var i=0;i<Subscription.length;i++){
                if(Subscription[i].jobFunction==response.jobFunction){

                        if (Subscription[i].jobType == response.jobType) {
                                counter+=1
                                console.log('job tpe incremented')
                        }
                        if (Subscription[i].location == response.location) {
                                counter+=1
                                console.log('location incremented')
                        }
                        if (Subscription[i].industryType == response.industryType) {
                                counter+=1
                                console.log('industry tpe incremented')
                        }
                        if ( parseInt(response.saraly) >= Subscription[i].saraly ) {
                                counter+=1
                                console.log('salary incremented')
                        }
                        if(counter==Subscription[i].criteria){
                                
                                if(Subscription[i].subscribe=='apply'){
                                       // callApply(Subscription[i],response)
                                        console.log('I apply for you')
                                }else{
                                       // callNotify(Subscription[i].email,response)
                                        console.log('I will notify you')
                                }
                        }
                        console.log(Subscription[i].criteria)
                        console.log('Counter '+counter)
                        counter=0
                }  
        }
        
}

//apply or the job if the similar job is found
const callApply= async (Subscription,response)=>{
        var Applications = new applications({
                selectedJob: Subscription.selectedJob,
                fname: Subscription.fname,
                lname: Subscription.lname,
                email: Subscription.email,
                phoneNo: Subscription.phoneNo,
                gender: Subscription.gender,
                maritalStatus: Subscription.maritalStatus,
                pAddress: Subscription.pAddress,
                file: Subscription.file,
                name: Subscription.name
        });

        await Applications.save()
        console.log('Job applied')

        var mailOptions = {
                from: 'joxey78@yahoo.com',
                to: Subscription.email,
                subject: 'A new job similar to the one you submitted had been created and we have applied for you',
                html:  "<div class='w3-card w3-padding'><h4>" + response.jobTitle + "\n\
                </h4><p>" + response.companyEmploying + "</p><p>" + response.location + " |\n\
               " + response.jobType + " | Ksh " + response.saraly + "</p><p>Industry Type: " + response.industryType + "</p><p>Job Function: " + response.jobFunction + "</p>'\n\
               <hr><p>" + response.description + "</p></div>"
              }
              transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error)
                } else {
                  console.log('Email sent: ' + info.response)
                }
              })
}

//notify the email if similar job is found
const callNotify= async (email,response)=>{
        var mailOptions = {
                from: 'joxey78@yahoo.com',
                to: email,
                subject: 'New Job Similar to the one you applied for has been posted',
                html:  "<div class='w3-card w3-padding'><h4>" + response.jobTitle + "\n\
                </h4><p>" + response.companyEmploying + "</p><p>" + response.location + " |\n\
               " + response.jobType + " | Ksh " + response.saraly + "</p><p>Industry Type: " + response.industryType + "</p><p>Job Function: " + response.jobFunction + "</p>'\n\
               <hr><p>" + response.description + "</p></div>"
              }
              transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error)
                } else {
                  console.log('Email sent: ' + info.response)
                }
              })
}

//find jobs belonging to an employer
router.get('/myJobs', async (req, res) => {
        if (!req.session.users) {
                res.send('not logged in')
        } else {
                var searched = []
                var empr = await employer.findOne({ _id: req.session.users })
                for (var i = 0; i < empr.myJobs.length; i++) {
                        var ans = await jobs.findOne({ _id: empr.myJobs[i].toString() })
                        searched.push(ans)
                }
                res.send(searched)
        }
})

//delete a job
router.post('/deleteAJob', async (req, res) => {
        const { id } = req.body
        await jobs.deleteOne({ _id: id.toString() })
        await employer.findByIdAndUpdate({ _id: req.session.users.toString() }, { $pull: { myJobs: id.toString() } }, { new: true })
        res.send('deleted')
})

//update a job
router.post('/updateAJob', async (req, res) => {
        try {
                if (!req.session.users) {
                        res.send('not logged in')
                } else {
                        var query = {}
                        const {
                                selectedJob,
                                jobTitle,
                                companyEmploying,
                                location,
                                jobType,
                                saraly,
                                jobFunction,
                                industryType,
                                description
                        } = req.body;
                        console.log(selectedJob)
                        console.log(location)
                        if (jobTitle != null && jobTitle != "") {
                                query.jobTitle = jobTitle
                        }
                        if (companyEmploying != null && companyEmploying != "") {
                                query.companyEmploying = companyEmploying
                        }
                        if (location != null && location != "") {
                                query.location = location
                        } if (jobType != null && jobType != "") {
                                query.jobType = jobType
                        } if (saraly != null && saraly != "") {
                                query.saraly = saraly
                        } if (jobFunction != null && jobFunction != "") {
                                query.jobFunction = jobFunction
                        } if (industryType != null && industryType != "") {
                                query.industryType = industryType
                        } if (description != null && description != "") {
                                query.description = description
                        }
                        var string = JSON.stringify(query)
                        console.log(string)
                        await jobs.updateOne({ _id: selectedJob }, query)
                        res.send("updated")
                        query = {}
                        var strin = JSON.stringify(query)
                        console.log(strin)

                }
        } catch (e) {
                console.error(e.message);
                res.status(500).send("Error in saving");

        }
})

module.exports = router;