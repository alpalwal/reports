/*
ping API every hour - 24h
if message > send email

http://api.38plank.com/v1/reports
var JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkFuZHJldyIsImVtYWlsIjoid2h5YnRocjIzMkBnbWFpbC5jb20iLCJpYXQiOjE0ODU5OTc0NTN9.WTpThgcPhQB6OJLeRd3A21ZxoZP7RO35n7rwATwKF-8';

Authorization: 'JWT <jwt>'
*/

//const JWT = process.env.JWT; //Auth token. Don't want to keep it in here

//JWT hard coded for now. remove later
var AWS = require("aws-sdk");
var request = require('request');
const JWT ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkFuZHJldyIsImVtYWlsIjoid2h5YnRocjIzMkBnbWFpbC5jb20iLCJpYXQiOjE0ODU5OTc0NTN9.WTpThgcPhQB6OJLeRd3A21ZxoZP7RO35n7rwATwKF-8";
const URL = "http://api.38plank.com/v1/reports";

var options = {
  url: URL,
  headers: {
    Authorization: "JWT " + JWT
  }
};

var postToSns = function(event, context) {
    var eventText = JSON.stringify(event, null, 2);
    console.log("Received event:", eventText);
    var sns = new AWS.SNS();
    var params = {
        Message: eventText,
        Subject: "Test SNS From Lambda",
        TopicArn: "arn:aws:sns:us-west-2:621958466464:andrew_reports"
    };
    //sns.publish(params, context.done);
    sns.publish(params, context);
};

function callback(error, response, body) {
  if (!error && response.statusCode == 200) {
    var info = JSON.parse(body);
    for (var i = 0; i < info.data.length; i++) {
      // here to the bottom HERE we're checking the reports for things that happened today
      var report = info.data[i];
      var elapsedTime = (new Date() - report.dateReported)
      //3600000 ms in an hour
      //86400000 in a day
      if (elapsedTime < 3600000) {
        // here we should send the email
        console.log("new report!");
        //postToSns("test texttt")
      } else { // clear this out once it works
        console.log("old news");
        postToSns("sns mmesssage")
      }
      // HERE
    }
  }
};


exports.handler = (event, context, callback) => {
    request(options, callback);
};
