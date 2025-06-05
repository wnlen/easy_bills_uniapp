// plugins/userLoader.js  
export default {
	install(Vue, options) {


		Vue.prototype.$pushMessage = function(data) {
			const message = uni.createPushMessage({
				title: '签收通知',
				content: '您的单据' + data + '发生变化，请前往易单据查看',
				icon: "static/icon/appMain.png",
				extra: {
					type: 'new_message',
					id: 123
				}
			});
		}



		Vue.prototype.$getCid = function(data) {
			// #ifdef APP
			uni.getPushClientId({
				success: (res) => {
					console.log("cid=====================>",res.cid);
				},
				fail(err) {
					console.log(err)
				}
			})
			// #endif

		}
		
		
		
		Vue.prototype.$monitorPushMessage = function(data) {
			
			let callback = (res)=>{
				console.log("message==========>",res)
			}
			
			uni.onPushMessage(callback)
		}
		

		// Vue.prototype.$pushMessage = function(data) {
		// 	console.log("------------------通知任务栏----------------");
		// 	// 在应用程序启动时获取CID
		// 	// uni.getPushClientId({
		// 	// 	success: (res) => {
		// 	// 		let push_clientid = res.cid
		// 	// 		console.log(push_clientid);
		// 	// 	},
		// 	// 	fail: (err) => {
		// 	// 		console.log(err);
		// 	// 	}
		// 	// })
		// 	 const message = uni.createPushMessage({
		// 	    title: '签收通知',
		// 	    content: '您的单据'+data+'发生变化，请前往易单据查看',
		// 	    extra: {
		// 	        type: 'new_message',
		// 	        id: 123
		// 	    }
		// 	});

		// 	// 打印创建的消息对象
		// 	console.log('创建的推送消息:', message);



		// }


	}
};