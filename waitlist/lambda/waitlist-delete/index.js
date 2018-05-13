'use strict';
const AWS = require('aws-sdk');
const sns = new AWS.SNS({apiVersion: '2010-03-31'});

const ddb = new AWS.DynamoDB.DocumentClient();

exports.handler = function(event, context, callback) {
    console.log(event);
    const requestBody = JSON.parse(event.body);
    console.log(requestBody); // Contains incoming request data (e.g., query params, headers and more)
  
    findWaitId(requestBody.tableSize).then(res=>{
        var ids = [];
        for (var i = 0; i < res['Items'].length; i++) {
            ids.push(Number(res['Items'][i].WaitlistId));
        }
        ids.sort(function(a, b){return a - b});
        console.log(requestBody.tableNum);
        deleteInUse(ids[0]);
        return assignTable(ids[1],requestBody.tableNum);
    }).then(()=>{
        sendText(requestBody.tableNum);
        return getRecords();
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

function findWaitId(tableSize) {
    return ddb.query({
        TableName: 'Waitlist',
        IndexName: 'Size-index',
        KeyConditionExpression: 'Size = :hkey',
        ExpressionAttributeValues: {
            ':hkey': tableSize
        }}).promise();
}

function deleteInUse(WaitlistId) {

    return ddb.delete({
        TableName: 'Waitlist',
        Key:{
        "WaitlistId":WaitlistId
        }
    }).promise();
}

 
function assignTable(waitId, tableNum) {
   var assParams = {
  TableName: 'Waitlist',
  Key: { WaitlistId : waitId },
  UpdateExpression: 'set #t = :x',
  ExpressionAttributeNames: {'#t' : 'AssignedTable'},
  ExpressionAttributeValues: {
    ':x' : tableNum
  }
};
    return ddb.update(assParams).promise();
}

function getRecords() {
    
    return ddb.scan({
        TableName : 'Waitlist'
    }).promise();
}



function sendText(tableNum) {
    var params = {
  Message: 'It is your turn. Your assigned table is '+tableNum+'.', 
  PhoneNumber: '+10000000000'
};
    sns.publish(params, function(err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else     console.log(data);           // successful response
});
}

