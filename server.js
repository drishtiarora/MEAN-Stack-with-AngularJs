var express = require('express');
var app= express();
var port = process.env.PORT || 3000;
var bodyParser = require('body-parser');
var cors= require('cors');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(cors());

mongoose.connect('mongodb://localhost:27017/jobPortal' , function(err){
    if(err){
        console.log("Not connected to db" + err);
    }
    else{
        console.log("Successfully connected");
    }
});

var userSchema = new Schema({
    email : String,
    location: String,
    password : String,
    phone : Number,
    username :String,
    jobDescription : String,
    jobTitle : String,
    keywords: String,
    location : String
})

var user= mongoose.model("user", userSchema);

app.post('/postJob', function(req,res){
    console.log("request for sending post data" , req.body);

    var jobs = new user({
        jobDescription : req.body.jobDescription,
        jobTitle : req.body.jobTitle,
        keywords : req.body.keywords,
        location: req.body.location
    });

    jobs.save(function(err, resp){
        if(err){
            console.log("error in posting job");
            res.send({
                isPosted : false,
                msg : "Could not post the job"
            });
        }
        else{
            console.log("Successfully posted the job");
            res.send({
                isPosted : true,
                msg: "Successfully posted the job"
            });
        }
    });
});

app.post('/register' , function(req,res){
    console.log("request for registeration" , req.body);

    var user1 = new user({
        email : req.body.email,
        location : req.body.location,
        password : req.body.password,
        phone : req.body.phone,
        username : req.body.username
    })

    user1.save(function(err, resp){
        if(err){
            console.log("error in registeration");
            res.send({
                isRegister : false,
                msg : "Registeration failed"
            });
        }
        else{
            console.log("registeration successfull");
            res.send({
                isRegister : true,
                msg : "Registeration successfully done"
            });
        }
    })
});

app.post('/login' , function(req,res){
    console.log("Hello from login");
    console.log("request from login", req.body);

    var query = user.findOne({"username" : req.body.username,
                            "password" : req.body.password})

    query.exec((err, result)=>{
        if(result != null){
            console.log("Record found!");
            res.send({
                isLoggedIn : true,
                msg: "Logged in successfully",
                loginInfo : result
            });
        }
        else{
            console.log("Result not found");
            res.send({
                isLoggedIn :false,
                msg : "Could not find details"
            });
        }
    });    
});

app.post('/searchJobs' , function(req,res){
    console.log("hello from search");
    console.log("request from search", req.body);
    var query = user.find({"keywords" : req.body.keywords,
                            "location" : req.body.location,
                            "title" : req.body.title})
    
    query.exec((err, result)=>{
        if(result != null){
            console.log("Job found!");
            res.send({
                isSearched : true,
                msg: "job found successfully",
                searchInfo : result
            });
        }
        else{
            console.log("Job not found");
            res.send({
                isSearched : false,
                msg : "job not found, try again!!",
            });
        }
    });

  

    });

app.get('/' , function(req,res){
    res.sendFile(__dirname+ '/public/index.html');
});

app.get('/searchJobs' , function(req,res){
    db.collection('users').find({}).toArray(function(err, docs){
        res.send(docs);
    });
});

app.post('/jobList' , function(req,res){

});

app.listen(port, function() {
    console.log("Running on port" + port);
    
});