var channelToken = 'Your channel access token';

// 回覆訊息
function replyMsg(replyToken, userMsg, channelToken) {
  var url = 'https://api.line.me/v2/bot/message/reply';
  var opt = {
    'headers': {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ' + channelToken,
    },
    'method': 'post',
    'payload': JSON.stringify({
      'replyToken': replyToken,
      'messages': [{'type': 'text', 'text': userMsg}]
    })
  };
  UrlFetchApp.fetch(url, opt);
}
// 發送訊息
function pushMsg(channelToken, message, usrId) {
  var url = 'https://api.line.me/v2/bot/message/push';
  var opt = {
    'headers': {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ' + channelToken,
    },
    'method': 'post',
    'payload': JSON.stringify({
      'to': usrId,
      'messages': [{'type': 'text', 'text': message}]
    })
  };
  UrlFetchApp.fetch(url, opt);
}

// e 是Line 給我們的資料
function doPost(e) {
  console.log('info:' + e.postData.contents);
  var value = JSON.parse(e.postData.contents);
  try {
    var events = value.events;
    if (events != null) {
      for (var i in events) {
        var event = events[i];
        var type = event.type;
        var replyToken = event.replyToken; // 要回復訊息 reToken
        var sourceType = event.source.type;
        var sourceId = LineHelpers.getSourceId(event.source);
        var userId = event.source.userId; // 取得個人userId
        var groupId = event.source.groupId; // 取得群組Id
        var timeStamp = event.timestamp;
        switch (type) {
          case 'postback':
            break;
          case 'message':
            var messageType = event.message.type;
            var messageId = event.message.id;
            var messageText = event.message.text; // 使用者的 Message_字串
            replyMsg(replyToken, messageText, channelToken);
            break;
          case 'join':
            pushMsg(channelToken, '我是Bot！Hello！', sourceId);
            break;
          case 'leave':
            pushMsg(channelToken, 'Good Bye！', sourceId);
            break;
          case 'memberLeft':
            pushMsg(channelToken, '我是Bot！Bye！', sourceId);
            break;
          case 'memberJoined':
            pushMsg(channelToken, '我是Bot！Hello~', sourceId);
            break;
          case 'follow':
            pushMsg(channelToken, 'Hello！', sourceId);
            break;
          case 'unfollow':
            pushMsg(channelToken, 'Bye bye！', sourceId);
            break;
          default:
            break;
        }
      }
    }
  } catch(ex) {
    console.log(ex);
  }
}

var LineHelpers = (function (helpers) {
  'use strict';
  helpers.getSourceId = function (source) {
    try {
      switch (source.type) {
        case 'user':
          return source.userId;
          break;
        case 'group':
          return source.groupId;
          break;
        case 'room':
          return source.roomId;
          break;
        default:
          console.log('LineHelpers, getSourceId, invalid source type!');
          break;
      }
    }
    catch (ex) {
      console.log('LineHelpers, getSourceId, ex = ' + ex);
    }
  }; 
  return helpers;
})(LineHelpers || {});
