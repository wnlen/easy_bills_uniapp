// plugins/push.js
export default {
	install(app, options) {
		app.config.globalProperties.$pushMessage = function (data) {
			const message = uni.createPushMessage({
				title: '签收通知',
				content: '您的单据' + data + '发生变化，请前往易单据查看',
				icon: 'static/icon/appMain.png',
				extra: {
					type: 'new_message',
					id: 123
				}
			});
		};

		app.config.globalProperties.$getCid = function () {
			// #ifdef APP
			uni.getPushClientId({
				success: (res) => {
					console.log('cid=====================>', res.cid);
				},
				fail(err) {
					console.log(err);
				}
			});
			// #endif
		};

		app.config.globalProperties.$monitorPushMessage = function () {
			let callback = (res) => {
				console.log('message==========>', res);
			};
			uni.onPushMessage(callback);
		};
	}
};
