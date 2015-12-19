var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose')
var Twitter = require('twitter');
var request = require('request');
var fs = require('fs');
var app = express();

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

app.get('/testing/:name', function (req, res){
	res.send(req.params.name);
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});