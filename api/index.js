// api/index.js
const files = import.meta.glob('./**/*.js', { eager: true })

export default (http) => {
  const modules = {}

  for (const path in files) {
	// 跳过index.js自身
    if (path === './index.js') continue

    // 提取目录名（模块名）
    const [, moduleName, fileName] = path.match(/\.\/([^/]+)\/([^/]+)\.js$/) || []

    if (!moduleName || !fileName) continue

    const mod = files[path].default

    // 初始化模块容器
    if (!modules[moduleName]) {
      modules[moduleName] = {}
    }

    // 合并每个文件导出的方法进模块中
    const resolvedModule = typeof mod === 'function' ? mod(http) : mod
    Object.assign(modules[moduleName], resolvedModule)
  }

  return modules
}