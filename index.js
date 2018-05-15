'use strict';

const Alexa = require('ask-sdk');
const other = require('./other.js');
var AWS = require("aws-sdk");
var dynamo = new AWS.DynamoDB.DocumentClient();
const TableName = "dinnerTable";

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    var msg = 'LaunchRequestgが呼ばれたときに発動します';

    return handlerInput.responseBuilder
      .speak(msg)
      .reprompt(msg) // これがあることによって会話が終了しない
      .getResponse();
  }
};

// 自分で定義したインテント
const getPerDataIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'getPerDataIntent';
  },
  handle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    if(request.intent.slots.family.resolutions.resolutionsPerAuthority[0].values){
      var familyNameValue = request.intent.slots.family.resolutions.resolutionsPerAuthority[0].values[0].value.name;
      var familyNameId = request.intent.slots.family.resolutions.resolutionsPerAuthority[0].values[0].value.id;
    }
    var params = getPerDataParams(familyNameId);

    return dynamo.get(params).promise().then( data => {
      console.log(data);
      if(data.Item && data.Item.isNeed){
        var msg = `${familyNameValue}さんは今晩、ご飯いるそうです。`;
      }else{
        var msg = `${familyNameValue}さんは今晩、ご飯いらないそうです。`;
      }
      return handlerInput.responseBuilder.speak(msg).getResponse();
    });

  }
};

function getPerDataParams(familyNameId){
  var params = {
    TableName : TableName,
    Key: {
      user: familyNameId
    }
  };
  return params;
}


//exports.handler = Alexa.SkillBuilders.custom()
exports.handler = Alexa.SkillBuilders.standard()
  .addRequestHandlers(
    LaunchRequestHandler,
    other.HelpIntentHandler,
    other.SessionEndedRequestHandler,
    getPerDataIntentHandler)
  //.addErrorHandlers(other.ErrorHandler)
  .lambda();
