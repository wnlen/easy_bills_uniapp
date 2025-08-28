import {
	useUserStore
} from '@/store/user';

// 视频列表
const videoList = [
	'export/UzFfAgtgekIEAQAAAAAAxJYlyJg3FgAAAAstQy6ubaLX4KHWvLEZgBPE_KFcQGI6MYyJzNPgMJotuHr8u0KB2xfY4RN8QuoS' /**发货端订单统计**/ ,
	'export/UzFfAgtgekIEAQAAAAAAP-EjEVINjQAAAAstQy6ubaLX4KHWvLEZgBPExaF0MGY1MIyJzNPgMJp9aViioFslDPj5E1FlonlH' /**收货端如何对账**/ ,
	'export/UzFfAgtgekIEAQAAAAAAvGY07g_ulQAAAAstQy6ubaLX4KHWvLEZgBPEx6EAbgBXMoyJzNPgMJrhNSRp3beWs3QsBOqn-goU' /**开单**/ ,
	'export/UzFfAgtgekIEAQAAAAAA5MwzpLcNFgAAAAstQy6ubaLX4KHWvLEZgBPEjqI0EiobM4yJzNPgMJpb1yCwlhD4QRwrvoYqs0B-' /**发货端查单**/ ,
	'export/UzFfAgtgekIEAQAAAAAAX2oFdu691QAAAAstQy6ubaLX4KHWvLEZgBPEg6IQWgpvNoyJzNPgMJrKnYd0jvBZgEVah9xutq1n' /**收货端查单**/ ,
	'export/UzFfAgtgekIEAQAAAAAA6yIo7s1fGwAAAAstQy6ubaLX4KHWvLEZgBPEmKI0Y3kwb_WIzNPgMJo3gU7o4yvLyUBCv6_PHqnv' /**发货端添加好友**/ ,
	'export/UzFfAgtgekIEAQAAAAAAiqAQev895gAAAAstQy6ubaLX4KHWvLEZgBPE9aEYTicfb_WIzNPgMJoCTVYyAZhh_KYBsLEYwend' /**收货端添加好友**/
	// "export/UzFfAgtgekIEAQAAAAAAM50D-egxYAAAAAstQy6ubaLX4KHWvLEZgBPE26F8ZyV2MIyJzNPgMJrXd6cQcLDboKUxo0Rsgicj", /**发货端添加好友**/
	// "export/UzFfAgtgekIEAQAAAAAAoZsGIyJRPgAAAAstQy6ubaLX4KHWvLEZgBPEyaFURgl0MYyJzNPgMJq_A5F-Nc1R82d-ll1XsXQ_" /**收货端添加好友**/
];

export default (http) => ({
	install(app) {
		app.config.globalProperties.$loadUser = (options = {}) => {
			console.log('--------->全局刷新个人信息START<-------------');

			const store = useUserStore();
			const User = store.user;

			const role = User.data?.work === '1' ? 1 : 2;
			uni.$api.user.refreshUser({
					phone: User.phone,
					role: role
				}).then(res => {
					const getNowData = res.data.data;
					const localData = {
						...User
					};
					localData.ac = getNowData.ac;
					localData.data = getNowData.data;
					localData.workData = getNowData.workData;
					localData.password = getNowData.password;
					localData.jurisdiction = getNowData.jurisdiction;

					store.user = localData;
					store.announcement = getNowData.announcement;
					store.guidanceD = getNowData.data.guidanceD;
					store.guidanceR = getNowData.data.guidanceR;
					store.work = getNowData.data.work === '1' ? 'Y' : 'N';

					if (localData.data?.state === '0') {
						uni.reLaunch({
							url: '/pages/subPack/user/affirm/applyAffirm'
						});
					}
				})
				.catch((err) => {
					console.error('用户信息刷新失败', err);
					// store.user = {
					// 	workData: {},
					// 	data: {
					// 		work: null
					// 	},
					// 	ac: {
					// 		enterpriseName: null
					// 	},
					// 	phone: null
					// };
				});

			console.log('--------->全局刷新个人信息END<-------------');
		};

		// 通知服务端
		app.config.globalProperties.$inform = (list) => {
			console.log('通知中...', uni.$api);
			uni.$api.task.startRWFlow({
					list: list
				})
				.then((res) => console.log('通知结果：', res))
				.catch((err) => console.log('通知失败：', err));
		};

		// 记录用户行为
		app.config.globalProperties.$record = () => {
			const userStore = useUserStore();
			const phone = userStore.user?.phone || '';
			if (!phone) {
				console.warn('[record] user.phone 不存在，跳过记录');
				return;
			}
			const pages = getCurrentPages();
			const currentPage = pages[pages.length - 1];
			const currentPagePath = currentPage.route;
			const dx = {
				phone,
				pages: currentPagePath,
				type: 0,
				createTime: new Date(),
				state: 1
			};
			uni.$api.user.behaviorAdd(dx)
				.then((res) => console.log('记录结果：', res))
				.catch((err) => console.log('记录失败：', err));
		};

		// 获取记录提醒
		app.config.globalProperties.$getRecord = (refs) => {
			const userStore = useUserStore();
			const phone = userStore.user?.phone || '';
			if (!phone) {
				console.warn('[getRecord] user.phone 不存在，跳过请求');
				return;
			}
			http.post('behavior/get', {
					phone
				})
				.then((res) => {
					console.log('记录结果：', refs.$refs.popLetter);
					if (res.data.data) {
						refs.$refs.popLetter.letter();
						refs.$refs.popLetter.show = true;
						app.config.globalProperties.$record();
					}
				})
				.catch((err) => console.log('记录失败：', err));
		};

		// 打开视频号
		app.config.globalProperties.$openVideo = (index) => {
			uni.openChannelsActivity({
				finderUserName: 'sphgIVBwvsJcDEZ',
				feedId: videoList[index],
				success: (res) => console.log('跳转成功', res),
				fail: (err) => console.log('跳转失败', err)
			});
		};

		// 获取设备型号对应 tabbar 高度
		app.config.globalProperties.$getModel = (callback) => {
			uni.getSystemInfo({
				success: (res) => {
					const model = res.model;
					const mapValue = modelMap.get(model);
					if (mapValue) return callback(mapValue);
					const simplified = model.split('<')[0];
					callback(modelMap.get(simplified) || '50px');
				},
				fail: (err) => {
					console.error('获取设备信息失败', err);
					callback('50px');
				}
			});
		};

		// 型号映射
		const modelMap = new Map([
			['iPhone 15 Pro Max', '55px'],
			['iPhone 15 Pro', '50px'],
			['iPhone 14 Pro Max', '55px'],
			['iPhone 14 Pro', '50px'],
			['iPhone 14 Plus', '50px'],
			['iPhone 14', '50px'],
			['iPhone 13 Pro Max', '55px'],
			['iPhone 13 Pro', '50px'],
			['iPhone 13', '50px'],
			['iPhone 13 Mini', '50px'],
			['iPhone 12 Pro Max', '50px'],
			['iPhone 12 Pro', '50px'],
			['iPhone 12', '50px'],
			['iPhone 12 Mini', '50px']
		]);
	}
});