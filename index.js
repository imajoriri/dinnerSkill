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

// 指定した人が晩飯いるかどうか聞く
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

    if(familyNameId && familyNameValue){
      return dynamo.get(params).promise().then( data => {
        console.log(data);
        if(data.Item && data.Item.isNeed){
          var msg = `${familyNameValue}さんは今晩、ご飯いるそうです。`;
        }else{
          var msg = `${familyNameValue}さんは今晩、ご飯いらないそうです。`;
        }
        return handlerInput.responseBuilder.speak(msg).getResponse();
      });
    }else{
      var msg = "指定した人は見つかりませんでした";
      return handlerInput.responseBuilder.speak(msg).getResponse();
    }


  }
};

// 指定した人が晩御飯いるをセットする
const setTruePerDataIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'setTruePerDataIntent';
  },
  handle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    if(request.intent.slots.family.resolutions.resolutionsPerAuthority[0].values){
      var familyNameValue = request.intent.slots.family.resolutions.resolutionsPerAuthority[0].values[0].value.name;
      var familyNameId = request.intent.slots.family.resolutions.resolutionsPerAuthority[0].values[0].value.id;
    }

    var params = setTrueOrFalseDataParams(true, familyNameId);
    return dynamo.update(params).promise().then( (data) => {
      var msg = `${familyNameValue}さんは今晩晩飯いるで登録しました。`;
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

function setTrueOrFalseDataParams(isNeed, familyNameId){
  var params = {
    TableName: TableName,
    Key:{
      user: familyNameId
    },
    UpdateExpression: "set isNeed = :bool",
    ExpressionAttributeValues:{
      ":bool": isNeed
    },
    ReturnValues:"UPDATED_NEW"
  };
  return params;
}



//exports.handler = Alexa.SkillBuilders.custom()
exports.handler = Alexa.SkillBuilders.standard()
  .addRequestHandlers(
    LaunchRequestHandler,
    other.HelpIntentHandler,
    other.SessionEndedRequestHandler,
    getPerDataIntentHandler,
    setTruePerDataIntentHandler)
  //.addErrorHandlers(other.ErrorHandler)
  .lambda();
