'use strict';
const AWS = require('aws-sdk');

const ddb = new AWS.DynamoDB.DocumentClient();
    console.log("**************START");
exports.handler = function(event, context, callback) {
    const requestBody = JSON.parse(event.body);
    console.log(requestBody); // Contains incoming request data (e.g., query params, headers and more)
  
    recordDemand(requestBody.firstName, requestBody.lastName, requestBody.tableSize, requestBody.phone).then((err,data)=>{
        if (err) console.log(err, err.stack); // an error occurred
        else     console.log(data);      
        //return getRecords();

    }).then(data=>{
        console.log(data);
        const response = {
        statusCode: 200,
        headers: {
        "Access-Control-Allow-Origin" : "*"
        },
        body: JSON.stringify(data)
    };

    callback(null, response);
    });
};

function recordDemand(first, last, size, phone) {
    return ddb.put({
        TableName: 'Waitlist',
        Item: {
            WaitlistId: new Date().getTime(),
            First: first,
            Last: last,
            Size: size,
            Phone: phone
        }
    }).promise();
}

var paramsForScan = {
  TableName : 'Waitlist'
};

function getRecords() {
    
    return ddb.scan(paramsForScan).promise();
}