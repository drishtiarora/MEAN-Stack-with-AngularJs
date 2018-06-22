var app = angular.module('myapp', ['ngRoute']);


app.config(function ($routeProvider) {
    $routeProvider.when('/', {
        template: `
            <h1> WELCOME TO JOB PORTAL </h1>
            <h3>To continue, go to Registeration</h3>
        `
    })
        .when('/register', {
            templateUrl: '/register.html',
            controller: 'register_controller'
        })
        .when('/login', {
            templateUrl: '/login.html',
            controller: 'login_controller'
        })
        .when('/home', {
            templateUrl: '/home.html',
            controller: 'home_controller'
        })
        .when('/postJob', {
            templateUrl: '/postJob.html',
            controller: 'postJob_controller'
        })
        .when('/searchJob',{
            templateUrl : '/searchJob.html',
            controller : 'searchJob_controller'
        })
        .when('/jobList' , {
            templateUrl : 'jobList.html',
            controller : 'jobList_controller'
        })
        .when('/appliedJobs' , {
            templateUrl : 'appliedJobs.html',
            controller : 'appliedJobs_controller'
        });
});

app.controller('register_controller', function ($scope, $http, $location) {
    $scope.regUser = function (regData) {
        console.log("Form submitted");
        console.log($scope.regData);
        $http.post('http://localhost:3000/register', $scope.regData)
            .then(function (data) {
                console.log(data);
                console.log(data.data.isRegister)
                if (data.data.isRegister) {
                    alert("registered successfully");
                    $location.path('/login');
                }
                else {
                    alert("Please try again");
                }
            })
    }
});

app.controller('postJob_controller', function ($scope,$location, $http) {
    $scope.postJob = function (jobData) {
        console.log("Form submitted");
        console.log($scope.jobData);
        $http.post('http://localhost:3000/postJob',$scope.jobData)
        .then(function(data){
            console.log(data);
            console.log(data.data.isPosted);
            if(data.data.isPosted){
                alert("Successfully posted the job")
            }
            else{
                alert("Please try again");
            }
        })
    }
    
    $scope.goToHome = function() {
        console.log("Hello");
        $location.path('/home');
    }

});

app.controller('login_controller', function ($scope, $http, $location) {
    $scope.login = function (authform) {
        console.log('login form submitted');
        console.log($scope.authform);
        $http.post('http://localhost:3000/login', $scope.authform)
            .then(function (data) {
                console.log(data)
                console.log(data.data.isLoggedIn)
                if (data.data.isLoggedIn) {
                    alert("logged in successfully");
                    $location.path('/home');
                }
                else {
                    alert("Please login again");
                }
            });
    }
});

app.controller('searchJob_controller' , function($scope,$http, $location){
    $scope.search = function(search){
        console.log("search form submitted");
        console.log($scope.searchData);
        $http.post('http://localhost:3000/searchJobs' , $scope.searchData)
        .then(function(data){
            console.log(data);
            console.log(data.data.isSearched);
            if(data.data.isSearched){
                alert("Searched the job....")
            }
            else{
                alert("Please try again");
            }
        })
    }
    $scope.goToHome = function() {
        console.log("Hello");
        $location.path('/home');
    }
    $scope.savedJobs = function(){
        console.log("Hello job list");
        $location.path('/jobList');
    }
    $scope.appliedJobs = function(){
        console.log("Hello Applied Jobs");
        $location.path('/appliedJobs');
    }
    $scope.reset = function(){
        $scope.searchData = {};
    }
});


app.controller('home_controller', function ($scope, $http, $location) {
    $scope.postJob = function() {
        console.log("Hello");
        $location.path('/postJob');
    }
    $scope.searchJob = function() {
        console.log("Hello from search");
        $location.path('/searchJob');
    }
    $scope.logout = function(){
        console.log("Hello from logout");
        alert("User Logged Out!!")
        $location.path('/login');
    }
});

app.controller('jobList_controller' , function($scope){

});

app.controller('appliedJobs_controller' , function($scope){

});