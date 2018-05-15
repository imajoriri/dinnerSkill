module.exports = {
  HelpIntentHandler: {
    canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
      var msg = 'ヘルプって言われた時に発動するよ';

      return handlerInput.responseBuilder
        .speak(msg)
        .reprompt(msg)
        .withSimpleCard('Hello World', msg)
        .getResponse();
    },
  },
  
  CancelStopIntentHandler: {
    canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
         || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
      var msg = 'ストップ、キャンセル';

      return handlerInput.responseBuilder
        .speak(msg)
        .reprompt(msg)
        .withSimpleCard('Hello World', msg)
        .getResponse();
    },
  },

  SessionEndedRequestHandler: {
    canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
      return handlerInput.responseBuilder.getResponse();
    },
  },

  // v1のunhandledと同等。
  ErrorHandler: {
    canHandle() {
      return true;
    },
    handle(handlerInput, error) {
      return handlerInput.responseBuilder
        .speak('もう一度おねがいします')
        .getResponse();
    },
  },
}
