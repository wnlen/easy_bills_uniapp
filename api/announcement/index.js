// src/api/announcement.js
export default (http) => ({
	// 添加公告
	addAnnouncement(param) {
		return http.post('announcement/add', param);
	}
});