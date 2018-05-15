'use strict';

const Alexa = require('ask-sdk');
const other = require('./other.js');

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
const sampleIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'sampleIntent';
  },
  handle(handlerInput) {
    var msg = "自分で定義したインテントの時に呼ばれます";

    return handlerInput.responseBuilder
      .speak(msg)
      .reprompt(msg)
      .withSimpleCard('カードを表示します', msg)
      .getResponse();
  }
};

//exports.handler = Alexa.SkillBuilders.custom()
exports.handler = Alexa.SkillBuilders.standard()
  .addRequestHandlers(
    LaunchRequestHandler,
    other.HelpIntentHandler,
    other.SessionEndedRequestHandler,
    sampleIntentHandler)
  .addErrorHandlers(other.ErrorHandler)
  .lambda();
