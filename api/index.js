const context = require.context('./', true, /\.js$/);  // 递归读取

export default (http) => {
	const modules = {};
	context.keys().forEach(fileName => {
		if (fileName === './index.js') return;

		const name = fileName
			.replace(/^\.\/|\.js$/g, '')
			.replace(/\//g, '_');

		const moduleFunc = context(fileName).default;
		modules[name] = typeof moduleFunc === 'function' ? moduleFunc(http) : moduleFunc;
	});
	return modules;
};