'use strict';
const AWS = require('aws-sdk');

const ddb = new AWS.DynamoDB.DocumentClient();

exports.handler = function(event, context, callback) {

    getRecords().then(data=>{
        const sortedData = data["Items"].map(item=>[item["WaitlistId"], item]).sort((a,b)=>a[0]-b[0]).map(([,item])=>item);
        data["Items"] = sortedData;
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


var paramsForScan = {
  TableName : 'Waitlist'
};

function getRecords() {
    
    return ddb.scan(paramsForScan).promise();
}