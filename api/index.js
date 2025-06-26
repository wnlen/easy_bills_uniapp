const context = require.context('.', false, /\.js$/);

export default (http) => {
	const modules = {};
	context.keys().forEach(fileName => {
		if (fileName === './index.js') return;
		const name = fileName.replace(/^\.\/|\.js$/g, '');
		const moduleFunc = context(fileName).default;
		modules[name] = typeof moduleFunc === 'function' ? moduleFunc(http) : moduleFunc;
	});
	return modules;
};