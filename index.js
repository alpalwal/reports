/*
Set the CloudWatch event to run every 24h

REQUIRED: JWT env variable.
Substitute your SNS ARN for the one shown
*/

const JWT = process.env.JWT; //Auth token. Don't want to keep it in here
var AWS = require("aws-sdk");
var request = require('request');
const URL = 'http://api.38plank.com/v1/reports';

var options = {
  url: URL,
  headers: {
    Authorization: "JWT " + JWT
  }
};

function hitApi(error, response, body) {
    if (!error && response.statusCode == 200) {
    var info = JSON.parse(body);

    for (var i = 0; i < info.data.length; i++) {
        var report = info.data[i];
        var elapsedTime = (new Date() - report.dateReported)
        //3600000 ms in an hour, 86400000 in a day
        if (elapsedTime && elapsedTime < 86400000) {
            console.log("new report!" + report)
            postToSns(report);
        }
    }
  }
};

var postToSns = function(event) {
    var eventText = JSON.stringify(event, null, 2);
    console.log("Received event:", eventText);
    var sns = new AWS.SNS();
    var params = {
        Message: eventText,
        Subject: "New Report found",
        TopicArn: "arn:aws:sns:us-west-2:621958466464:andrew_reports"
    };
    sns.publish(params, function(error,data){console.log(error + data);});
};

exports.handler = (event, context, callback) => {
    request(options, hitApi);
};
