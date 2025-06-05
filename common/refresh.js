export default {
  install(Vue) {
	Vue.prototype.$loadUser = (vm) => {
		console.log("--------->全局刷新个人信息<-------------");

		const vuexUser = vm.$store?.state?.vuex_user;

		if (!vuexUser || !vuexUser.phone) {
			console.warn("vuex_user 不存在或未登录，跳转登录页");
			uni.navigateTo({ url: "/pages/subUser/login" });
			return;
		}

		const role = vuexUser.data?.work === "1" ? 1 : 2;

		vm.$u.post(`edo/user/renewal?phone=${vuexUser.phone}&role=${role}`).then(res => {
			const getNowData = res.data.data;
			const localData = { ...vuexUser };

			localData.ac = getNowData.ac;
			localData.data = getNowData.data;
			localData.workData = getNowData.workData;
			localData.vuex_password = getNowData.password;
			localData.jurisdiction = getNowData.jurisdiction;

			vm.$u.vuex('guidanceD', getNowData.data.guidanceD);
			vm.$u.vuex('guidanceR', getNowData.data.guidanceR);
			vm.$u.vuex('announcement', getNowData.announcement);
			vm.$u.vuex('vuex_user', localData);
			vm.$u.vuex('vuex_work', getNowData.data.work === "1" ? 'Y' : 'N');

			// 根据用户状态跳转
			if (localData.data?.state === "0") {
			uni.reLaunch({ url: "/pages/subPack/user/affirm/applyAffirm" });
			}
		})
		.catch(err => {
			console.error("用户信息刷新失败", err);
			vm.$u.vuex('vuex_user', {
			workData: {},
			data: { work: null },
			ac: { enterpriseName: null },
			phone: null
			});
		});

		console.log("--------->全局刷新个人信息更新成功<-------------");
	};

    // 通知服务端
    Vue.prototype.$inform = (vm, list) => {
      console.log("通知中...");
      vm.$u.post(`/edo/rw/start?list=${list}`)
        .then(res => console.log("通知结果：", res))
        .catch(err => console.log("通知失败：", err));
    };
	

    Vue.prototype.$record = (vm) => {
		console.log('adadddddd')
      const pages = getCurrentPages();
      const currentPage = pages[pages.length - 1];
      const currentPagePath = currentPage.route;
    
      const phone = vm?.$store?.state?.vuex_user?.phone || '';
    
      if (!phone) {
        console.warn('[record] vuex_user.phone 不存在，跳过记录');
        return;
      }
    
      const dx = {
        phone,
        pages: currentPagePath,
        type: 0,
        createTime: new Date(),
        state: 1
      };
    
      vm.$u.post('/edo/behavior/add', dx)
        .then(res => console.log("记录结果：", res))
        .catch(err => console.log("记录失败：", err));
    };

    // 获取记录提醒
    Vue.prototype.$getRecord = (vm) => {
		const phone = vm?.$store?.state?.vuex_user?.phone || '';

		if (!phone) {
			console.warn('[getRecord] 未找到 vuex_user.phone，跳过请求');
			return;
		}

		vm.$u.post('/edo/behavior/get', { phone }).then(res => {
			console.log("记录结果：", res);
			if (res.data.data) {
				vm.$refs.popLetter.show = true;
				vm.$refs.popLetter.letter();
				vm.$record(vm); // 如果 $record 也用到 vuex_token，请同步修改
			}
		}).catch(
			err => console.log("记录失败：", err)
		);
    };

    // 视频列表
    const videoList = [
		"export/UzFfAgtgekIEAQAAAAAAxJYlyJg3FgAAAAstQy6ubaLX4KHWvLEZgBPE_KFcQGI6MYyJzNPgMJotuHr8u0KB2xfY4RN8QuoS", /**发货端订单统计**/
		"export/UzFfAgtgekIEAQAAAAAAP-EjEVINjQAAAAstQy6ubaLX4KHWvLEZgBPExaF0MGY1MIyJzNPgMJp9aViioFslDPj5E1FlonlH", /**收货端如何对账**/
		"export/UzFfAgtgekIEAQAAAAAAvGY07g_ulQAAAAstQy6ubaLX4KHWvLEZgBPEx6EAbgBXMoyJzNPgMJrhNSRp3beWs3QsBOqn-goU", /**开单**/
		"export/UzFfAgtgekIEAQAAAAAA5MwzpLcNFgAAAAstQy6ubaLX4KHWvLEZgBPEjqI0EiobM4yJzNPgMJpb1yCwlhD4QRwrvoYqs0B-", /**发货端查单**/
		"export/UzFfAgtgekIEAQAAAAAAX2oFdu691QAAAAstQy6ubaLX4KHWvLEZgBPEg6IQWgpvNoyJzNPgMJrKnYd0jvBZgEVah9xutq1n", /**收货端查单**/
		"export/UzFfAgtgekIEAQAAAAAA6yIo7s1fGwAAAAstQy6ubaLX4KHWvLEZgBPEmKI0Y3kwb_WIzNPgMJo3gU7o4yvLyUBCv6_PHqnv", /**发货端添加好友**/
		"export/UzFfAgtgekIEAQAAAAAAiqAQev895gAAAAstQy6ubaLX4KHWvLEZgBPE9aEYTicfb_WIzNPgMJoCTVYyAZhh_KYBsLEYwend" /**收货端添加好友**/
		// "export/UzFfAgtgekIEAQAAAAAAM50D-egxYAAAAAstQy6ubaLX4KHWvLEZgBPE26F8ZyV2MIyJzNPgMJrXd6cQcLDboKUxo0Rsgicj", /**发货端添加好友**/
		// "export/UzFfAgtgekIEAQAAAAAAoZsGIyJRPgAAAAstQy6ubaLX4KHWvLEZgBPEyaFURgl0MYyJzNPgMJq_A5F-Nc1R82d-ll1XsXQ_" /**收货端添加好友**/
	];

    // 打开视频号
    Vue.prototype.$openVideo = (vm, index) => {
      uni.openChannelsActivity({
        finderUserName: "sphgIVBwvsJcDEZ",
        feedId: videoList[index],
        success: res => console.log("跳转成功", res),
        fail: err => console.log("跳转失败", err)
      });
    };

    // 获取设备信息并返回对应高度
    Vue.prototype.$getModel = (callback) => {
      uni.getSystemInfo({
        success: res => {
          const model = res.model;
          const mapValue = modelMap.get(model);
          if (mapValue) {
            callback(mapValue);
            return;
          }

          const simplified = model.split("<")[0];
          const simplifiedValue = modelMap.get(simplified);
          callback(simplifiedValue || "50px");
        },
        fail: err => {
          console.error("获取设备信息失败", err);
          callback("50px");
        }
      });
    };

    // 设备型号 → tab 高度
    const modelMap = new Map([
      ["iPhone 15 Pro Max", "55px"],
      ["iPhone 15 Pro", "50px"],
      ["iPhone 14 Pro Max", "55px"],
      ["iPhone 14 Pro", "50px"],
      ["iPhone 14 Plus", "50px"],
      ["iPhone 14", "50px"],
      ["iPhone 13 Pro Max", "55px"],
      ["iPhone 13 Pro", "50px"],
      ["iPhone 13", "50px"],
      ["iPhone 13 Mini", "50px"],
      ["iPhone 12 Pro Max", "50px"],
      ["iPhone 12 Pro", "50px"],
      ["iPhone 12", "50px"],
      ["iPhone 12 Mini", "50px"],
      
      ["iPhone 15 pro Max", "55px"],
      ["iPhone 15 pro max", "55px"],
      ["iPhone 15 pro", "50px"],
      ["iPhone 14 pro Max", "55px"],
      ["iPhone 14 pro max", "55px"],
      ["iPhone 14 pro", "50px"],
      ["iPhone 14 plus", "50px"],
      ["iPhone 14", "50px"],
      ["iPhone 13 pro Max", "55px"],
      ["iPhone 13 pro max", "55px"],
      ["iPhone 13 pro", "50px"],
      ["iPhone 13", "50px"],
      ["iPhone 13 mini", "50px"],
      ["iPhone 12 pro Max", "50px"],
      ["iPhone 12 pro max", "50px"],
      ["iPhone 12 pro", "50px"],
      ["iPhone 12", "50px"],
      ["iPhone 12 mini", "50px"]
      // 可以继续添加其他型号
    ]);
  }
};