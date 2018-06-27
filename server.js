var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var bodyParser = require('body-parser');
var cors = require('cors');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.Promise = require('q').Promise;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cors());

mongoose.connect('mongodb://localhost:27017/jobPortal', function (err, client) {
    if (err) {
        console.log("Not connected to db" + err);
    }
    else {
        console.log("Successfully connected");
        app.listen(port, function () {
            console.log("Running on port" + port);
        });
    }
});

var userSchema = new Schema({
    email: {type: String,
            unique :true},
    location: String,
    password: {
        type: String,
        required: [true, "Password is Required!!"]
    },
    phone: Number,
    username: {
        type: String,
        unique: [true, "Username should be unique"],
        required: [true, "Username is required"]
    },
    userType: String
})

var jobSchema = new Schema({
    jobDescription: String,
    jobTitle: {
        type: String,
        unique: true,
        required: true
    },
    keywords: String,
    jobLocation: String
})

var savedJobSchema = new Schema({
    username: String,
    jobDescription: String,
    jobTitle: String,
    keywords: String,
    jobLocation: String
})

var appliedJobSchema = new Schema({
    username: String,
    jobDescription: String,
    jobTitle: String,
    keywords: String,
    jobLocation: String
})

var user = mongoose.model("user", userSchema);
var job = mongoose.model("job", jobSchema);
var saveJob = mongoose.model('saveJob', savedJobSchema);
var appliedJob = mongoose.model("appliedJob", appliedJobSchema)

app.post('/postJob', function (req, res) {
    console.log("request for sending post data", req.body);

    var jobs = new job({
        jobDescription: req.body.jobDescription,
        jobTitle: req.body.jobTitle,
        keywords: req.body.keywords,
        jobLocation: req.body.jobLocation
    });

    jobs.save(function (err, resp) {
        if (err) {
            res.send({
                isPosted: false,
                msg: "Could not post the job"
            });
        }
        else {
            res.send({
                isPosted: true,
                msg: "Successfully posted the job"
            });
        }
    });
});

app.post('/register', function (req, res) {
    var user1 = new user({
        email: req.body.email,
        location: req.body.location,
        password: req.body.password,
        phone: req.body.phone,
        username: req.body.username,
        userType: req.body.userType
    })

    user1.save(function (err, resp) {
        if (err) {
            res.send({
                isRegister: false,
                msg: "Registeration failed"
            });
        }
        else {
            res.send({
                isRegister: true,
                msg: "Registeration successfully done"
            });
        }
    })
});

app.post('/appliedJobs', function (req, res) {

    var jobs = new appliedJob({
        username: req.body.username,
        job_id: req.body._id,
        jobDescription: req.body.jobDescription,
        jobTitle: req.body.jobTitle,
        keywords: req.body.keywords,
        jobLocation: req.body.jobLocation
    });

    jobs.save((err, result) => {
        if (result != null) {
            res.send({
                isApplied: true,
                msg: "Applied job displayed successfully",
                appliedInfo: result
            });
        }
        else {
            res.send({
                isApplied: false,
                msg: "Applied job not found!"
            });
        }
    });

});

app.post('/saveJob', function (req, res) {
 
    var job1 = new saveJob({
        username: req.body.username,
        job_id: req.body.job_id,
        jobDescription: req.body.jobDescription,
        jobTitle: req.body.jobTitle,
        keywords: req.body.keywords,
        jobLocation: req.body.jobLocation
    });

    job1.save((err, result) => {
        if (result != null) {
            res.send({
                isSaved: true,
                msg: "Saved job displayed successfully",
                savedInfo: result
            });
        }
        else {
            res.send({
                isSaved: false,
                msg: "Saved job not found!"
            });
        }
    });
});


app.post('/login', function (req, res) {

    var query = user.findOne({
        "username": req.body.username,
        "password": req.body.password
    })

    query.exec((err, result) => {
        if (result != null) {
            res.send({
                isLoggedIn: true,
                msg: "Logged in successfully",
                loginInfo: result
            });
        }
        else {
            res.send({
                isLoggedIn: false,
                msg: "Could not find details"
            });
        }
    });
});

app.post('/searchJobs', function (req, res) {

     var search_params_keywords = req.body.search_params.keywords;
     var search_params_title = req.body.search_params.title;
      //search_params_title = req.body.search_params.title
      console.log("keyword is" ,search_params_keywords);
      console.log("title is" ,search_params_title);
    //     search_query = [];
    // for(key in search_params) {
    //     if(search_params[key]) {
    //         search_query.push({key:search_params[key]});
    //     }
    // }

    console.log("searched param is" ,search_params_keywords);

    var query = job.find({$or : [{keywords: search_params_keywords}, {jobTitle : search_params_title}]});

    query.exec((err, result) => {
        console.log("result is" ,result);
       
        if (result != null) {
            console.log("search result" , result);
            res.send({
                isSearched: true,
                msg: "job found successfully",
                searchInfo: result
            });
        }

        else {
            res.send({
                isSearched: false,
                msg: "job not found, try again!!",
            });
        }
    });
});

app.get('/jobList', function (req, res) {
 
    var query = job.find();
    query.exec((err, resp) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log("record found");
            res.send(resp);
        }
    });
});

app.post('/saveJobList', function (req, res) {
    var query = saveJob.find({ "username": req.body.username });
    query.exec((err, resp) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log("record found", resp);
            res.send(resp);
        }
    });
});

app.post('/reset', function(req,res){
    var query = saveJob.remove({"username" : req.body.username});
    query.exec((err,resp)=>{
        if(err){
            console.log(err);
        }
        else{
            console.log("reset done!!");
            res.send(resp);
        }
    });
})

app.post('/resetAppliedJobs' , function(req,res){
    var query = appliedJob.remove({"username" : req.body.username});
    query.exec((err,resp)=>{
        if(err){
            console.log(err);
        }
        else{
            console.log("reset done!!");
            res.send(resp);
        }
    });
})

app.post('/appliedJobList', function (req, res) {
    var query = appliedJob.find({"username" : req.body.username});
    query.exec((err, resp) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log("applied found");
            res.send(resp);
        }
    });
});

app.get('/', function (req, res) {

    res.sendFile(__dirname + '/public/index.html');
});
