# インストール

```
npm install --save ask-auxiliary
```

# 使い方

```js
const askAuxiliary = require('ask-auxiliary');
```

## スロット取得

```js
var slotValue = askAuxiliary.getSlot(handlerInput, "keyName"); // そのまま取得
var slotFixedValue = askAuxiliary.getFixedSlot(handlerInput, "keyName"); // 類義語を設定した時、値を固定で取得したい時
var slotId = askAuxiliary.getSlotId(handlerInput, "keyName");
```
