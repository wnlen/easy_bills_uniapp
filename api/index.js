// api/index.js
const files = import.meta.glob('./**/*.js', {
	eager: true
})

export default (http) => {
	const modules = {}

	for (const path in files) {
		if (path.includes('index.js')) continue

		// 提取模块名，例如 './user/invite.js' → 'user_invite'
		const name = path
			.replace(/^\.\/|\.js$/g, '') // 去掉开头 ./ 和结尾 .js
			.replace(/\//g, '_') // 替换 / 为 _，支持子目录

		const mod = files[path].default
		modules[name] = typeof mod === 'function' ? mod(http) : mod
	}

	return modules
}