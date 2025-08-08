// // 'use strict';
// // exports.main = async (event, context) => {
// // 	//event为客户端上传的参数
// // 	console.log('event : ', event)

// // 	//返回数据给客户端
// // 	return event
// // };
// 'use strict';

// const uniPush = uniCloud.getPushManager({
//     appId: "__UNI__87FAB0A" // 你的应用appId
// })
// exports.main = async (event) => {
//     // event为客户端上传的参数
//     const body = JSON.parse(event.body)
//     // const body = event
//     return await uniPush.sendMessage({
//         "force_notification": true,// 填写true，客户端就会对在线消息自动创建“通知栏消息”，不填写则需要客户端自己处理。
//         "push_clientid": body.cids, // 必选 设备id，支持多个以数组的形式指定多个设备，如["cid-1","cid-2"]，数组长度不大于1000
//         "title": body.title, //必填 通知栏显示的标题
//         "content": body.content, //必填 通知栏显示的内容
//         "payload": body.data, //可选 自定义数据
//         "open_url": body.open_url, //可选 需要打开外部url就填写
//         "request_id": body.request_id, //必填 请求唯一标识号，10-32位之间；如果request_id重复，会导致消息丢失
//         // options更多参数介绍：https://doc.dcloud.net.cn/uniCloud/uni-cloud-push/options.html
//         "options": {
//             "HW": {
//                 // 1 表示华为测试消息，华为每个应用每日可发送该测试消息500条，target_user_type 参数请勿发布至线上。
//                 "/message/android/target_user_type": 1,
//                 // "/message/android/category": "WORK"
//             },
//             "HO": {
//                 //值为int 类型。1 表示测试推送，不填默认为0。荣耀每个应用每日可发送该测试消息1000条。此测试参数请勿发布至线上。
//                 "/android/targetUserType": 1
//             },
//             "VV": {
//                 //值为int 类型。0 表示正式推送；1 表示测试推送，不填默认为0。此 pushMode 参数请勿发布至线上。
//                 "/pushMode": 1
//             },
//             "XM": {
//                 //新小米消息分类下，私信公信id都必须要传，否则请求小米厂商接口会被拦截
//                 "/extra.channel_id": "填写小米平台申请的渠道id"
//             }
//         }
//     })
// };

// 简单的使用示例
'use strict';
const uniPush = uniCloud.getPushManager({ appId: '__UNI__87FAB0A' }); //注意这里需要传入你的应用appId，用于指定接收消息的客户端
exports.main = async (event, context) => {
    return await uniPush.sendMessage({
        push_clientid: '9a43e1711ef11d10c3ed0ee49c2ca29b', //填写上一步在uni-app客户端获取到的客户端推送标识push_clientid
        title: '通知栏显示的标题',
        content: '通知栏显示的内容',
        payload: {
            text: '体验一下uni-push2.0'
        }
    });
};
