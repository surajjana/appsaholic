var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose')
var Twitter = require('twitter');
var Appsaholic = require('appsaholic-sdk');
var request = require('request');
var fs = require('fs');
var app = express();

var Session = Appsaholic.Session;
var User = Appsaholic.User;
var session = new Session('23685400c3735bc4ea3dd23fd2f2e139951a50c6', 'a2862fa5eef622b06d2dad1433da936516ec13a3', 'e8d90954-8ce7-498e-96f3-cac57f54e524');
var user = new User(session);

var tweets_res = '';

app.use(bodyParser());

app.set('port', (process.env.PORT || 5000));


app.get('/', function (request, response) {

  response.send("Hello, testing... :)");

});

app.get('/tweets/:handle', function (req, res){

	var tweet_msg = '';
 
	var client = new Twitter({
	  consumer_key: 'jxnqynJxmIV6tdPfcYg4hlII4',
	  consumer_secret: 'I7WsmZoSjfJAoyKR0EZuhen26hCI36AiV9rkyc2xmgrfIx0Vlb',
	  access_token_key: '97393662-TDgbHRNjkCkXZnRoGeyCz32kgjN6UwyetMQ258h5E',
	  access_token_secret: 'y35T8LKMu2JDF6n5eY3VpOZjlMrFkkxWwkum1yGpjtUx8'
	});
 
	var params = {count: '5',screen_name: req.params.handle};
	client.get('statuses/user_timeline', params, function(error, tweets, response){
	  if (!error) {
	  	tweets_res = tweets;	  	
	  	for(var i=0;i<5;i++){
	  		tweet_msg += tweets[i].text + ' ';
	  	}
	  	//console.log(tweet_msg);
	  	request("https://apihackday.herokuapp.com/sentiment/"+tweet_msg, function(error, response, body) {
		  var resp = body;
		  console.log("Score : "+body);
		  res.send(200, resp);
		  
		});
	  }
	});
	//response.send("1");
});

app.get('/sentiment/:msg', function (req, res){
	//var msg = req.body['msg'];
	var tmp;
	var msg = req.params.msg;
	request("https://api.havenondemand.com/1/api/sync/analyzesentiment/v1?text="+msg+"&apikey=4c517421-8409-4a33-8b20-cf547c587cf3", function(error, response, body) {
	  var resp = body;
	  var a = JSON.parse(resp);
	  console.log("inside the request callback: " + a.aggregate.score);
	  tmp = a.aggregate.score;
	  if(tmp>0)
	  	res.send(200, "0");
	  else
	  	res.send(200,"1");
	});
});


app.get('/try_perk', function (req, res){
	user.getInformation().then(function(user) {
		console.log("ID: %s", user.id);
		console.log("Email: %s", user.email);
		console.log("First Name: %s", user.first_name);
		console.log("Last Name: %s", user.last_name);
		console.log("Available Points: %d", user.available_points);
		console.log("Pending Points: %d", user.pending_points);
		}).catch(function(error) {
		console.log("An error has occurred while getting the users information");
		console.log("Name: %s", error.name);
		console.log("Reason: %s", error.message);
		console.log("Code: %s", error.code);
		console.log(error);
	});
	res.send("Trying perk!!");
});


app.get('/testing/:name', function (req, res){
	res.send(req.params.name);
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});