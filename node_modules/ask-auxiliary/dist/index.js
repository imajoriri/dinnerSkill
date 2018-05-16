function AskAuxiliary(){
}

AskAuxiliary.prototype = {
  // LaunchRequestだったらtrueを返す
  isLaunchRequest: function(handlerInput){
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },

  // IntentRequestを前提にインテントをチェック。
  // params true or false
  isIntent: function(handlerInput, intentName){
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === intentName;
  },

  // sessionEndedRequestかどうか
  isSessionEndedRequest: function(handlerInput){
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },

  // 一般的なスロット取得方法
  getSlot: function(handlerInput, key){
    var request = handlerInput.requestEnvelope.request;
    var slots = request.intent.slots[key];
    if(slots === undefined){
      throw new Error("not defined " + key + " slots");
    }else{
      return slots.value;
    }
  },

  // 類義語を設定している時
  getFixedSlot: function(handlerInput, key){
    var request = handlerInput.requestEnvelope.request;
    var slots = request.intent.slots[key];
    if(slots === undefined){
      throw new Error("not defined " + key + " slots");
    }else if(slots.resolutions.resolutionsPerAuthority[0].values === undefined){
      throw new Error(key + " の類義語設定してない場合は[getSlot]メソッドを使用してね");
    }else{
      return slots.resolutions.resolutionsPerAuthority[0].values[0].value.name;
    }
  },

  // id取得
  getSlotId: function(handlerInput, key){
    var request = handlerInput.requestEnvelope.request;
    var slots = request.intent.slots[key];
    if(slots === undefined){
      throw new Error("not defined " + key + " slots");
    }else if(slots.resolutions.resolutionsPerAuthority[0].values === undefined){
      throw new Error(key + " の類義語設定してない場合は[getSlot]メソッドを使用してね");
    }else{
      return slots.resolutions.resolutionsPerAuthority[0].values[0].value.id;
    }
  },

}

module.exports = new AskAuxiliary();
