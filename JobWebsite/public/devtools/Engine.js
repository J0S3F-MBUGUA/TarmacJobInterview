/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
//<script type="module" src="/jquery.min.js"></script>


//var query=require('jquery.min.js');
//import * as query from "jquery.min.js";
var database = [
    {
        id: 1,
        title: "Sales Executive",
        company: "Fargo Limited Co.",
        location: "Nairobi",
        type: "Full-Time",
        salary: "35000",
        job_function: "sales",
        description: "We are looking for competitive sales executive to help us build our sales portfolio for bulk"},
    {
        id: 2,
        title: "Maret Research specilist",
        company: "Indipendent Researchers.",
        location: "Nakuru",
        type: "Part-Time",
        salary: "25000",
        job_function: "Consulting & Strategy",
        description: "We are looking for an experienced Market Research Specialist with outsttanding organisation and marketing skills"
    },
    {
        id: 3,
        title: "Quality Assuarance Manager",
        company: "Anonymous",
        location: "Kitale",
        type: "Full-Time",
        salary: "30000",
        job_function: "Quality Controll and Assurance",
        description: "Searching for a uality Assurance Manager(QA) responsible for developing and executing exploratory"
    },
    {
        id: 4,
        title: "Consumer Service Representative FMCG(Githunguri)",
        company: "Corporate Staffing Ltd.",
        location: "Kisii",
        type: "Full-Time",
        salary: "30000",
        job_function: "Customer service & Support",
        description: "Our client is a leading Dairy farmers Co-Operative Society dealing with processed dairy products..."
    },
    {
        id: 5,
        title: "Engineer Supervisor - FMCG",
        company: "Corporate Staffing Ltd.",
        location: "Mombasa",
        type: "Full-Time",
        salary: "Confidential",
        job_function: "Engineering & Technology",
        description: "Our client is a leading Dairy farmers Co-Operative Society dealing with processed dairy products..."
    }
];
var jobs = document.getElementById("applications");
var limit = 0;
//var statement = "";
for (limit = 0; limit < database.length; limit++) {

    jobs.innerHTML += "<a href='Submit Job.html' style='text-decoration: none'><div class='w3-card w3-padding' id='thejob'><h4>" + database[limit].title + "\n\
</h4><p>" + database[limit].company + "<span class='w3-right w3-text-deep-orange'>New</span></p><p>" + database[limit].location + " |\n\
 " + database[limit].type + " | Ksh " + database[limit].salary + "</p><p>Job Function: " + database[limit].job_function + ".<span class='w3-right></p>'\n\
 <hr><p>" + database[limit].description + "</p></div></a>";

}


//jobs.innerHTML = statement;

