// utils/font-loader.js
// 多字体一次性全局加载（mp-weixin/app-plus 本地缓存；h5 走 CSS 即可）

let PLATFORM = 'h5'
try {
	PLATFORM = uni.getSystemInfoSync().uniPlatform
} catch (e) {
	console.warn('[font] getSystemInfoSync failed, fallback to h5', e)
}

// 在这里按需配置你的字体清单（把 URL 换成你的真实地址）
export const FONTS = [{
		key: 'YRDZS_font_V1', // 唯一键，变更版本号可强制刷新
		family: 'YRDZS-Semibold', // 页面里就用这个 family 名称
		url: 'https://ydj-lsy.oss-cn-shanghai.aliyuncs.com/font/YSDZT-Semibold.woff2',
	},
	{
		key: 'Alike_font_V1',
		family: 'Alike Angular',
		url: 'https://ydj-lsy.oss-cn-shanghai.aliyuncs.com/font/DDBH.woff2',
	},
	{
		key: 'SYST_font_V1',
		family: 'SYST-font',
		url: 'https://ydj-lsy.oss-cn-shanghai.aliyuncs.com/font/syst.woff2',
	}
]

// ——— 工具函数 ——— //
function getCachedPath(key) {
	try {
		return uni.getStorageSync(key) || ''
	} catch {
		return ''
	}
}

function setCachedPath(key, path) {
	try {
		uni.setStorageSync(key, path)
	} catch {}
}

async function downloadToLocal(url) {
	const dl = await uni.downloadFile({
		url
	})
	if (dl.statusCode !== 200) {
		throw new Error('font download failed: ' + url + ', code=' + dl.statusCode)
	}

	if (PLATFORM === 'mp-weixin') {
		const sf = await uni.saveFile({
			tempFilePath: dl.tempFilePath
		})
		return sf.savedFilePath // wxfile://*
	}
	// app-plus：直接使用临时文件（或自行复制到 _doc/ 持久目录）
	return dl.tempFilePath // file://*
}

function loadOneFontGlobally(family, sourceUrlOrPath) {
	return new Promise((resolve, reject) => {
		uni.loadFontFace({
			global: true,
			family,
			source: `url("${sourceUrlOrPath}")`,
			success: (res) => {
				// console.log('[font] load success:', family, sourceUrlOrPath, res)
				resolve(res)
			},
			fail: (err) => {
				// console.error('[font] load error:', family, sourceUrlOrPath, err)
				reject(err)
			}
		})
	})
}

/**
 * 确保一款字体可用（mp/app：本地缓存后再全局注入；h5：直接用 CSS 即可）
 */
async function ensureOneFontReady({
	key,
	family,
	url
}) {
	// H5 推荐用 @font-face + preload，不强制注入；
	// 若想统一走 loadFontFace，可删掉这一行 return。
	if (PLATFORM === 'h5') {
		console.log('[font] h5 skip loadFontFace, family=', family)
		return
	}

	// mp-weixin / app-plus：走本地缓存路径，避免 iOS 页面间重复加载
	let localPath = getCachedPath(key)
	try {
		if (!localPath) {
			localPath = await downloadToLocal(url)
			setCachedPath(key, localPath)
		}
		await loadOneFontGlobally(family, localPath)
	} catch (e) {
		// 兜底：本地失败时，尝试直接用远程 URL 注入（网络可用时仍能成功）
		console.warn(`[font] fallback to remote url for ${family}`, e)
		// 本地失败就清掉缓存路径，下次重下
		setCachedPath(key, '')
		try {
			await loadOneFontGlobally(family, url)
		} catch (e2) {
			console.error(`[font] load failed: ${family}`, e2)
			throw e2
		}
	}
}

// 保证只初始化一次
let fontsReadyPromise = null

/** 一次加载多款字体（建议在 App.vue 的 onLaunch 调用） */
export function ensureFontsReady(fontList = FONTS) {
	if (fontsReadyPromise) return fontsReadyPromise

	console.log('[font] ensureFontsReady start, platform =', PLATFORM)

	fontsReadyPromise = (async () => {
		for (const f of fontList) {
			await ensureOneFontReady(f)
		}
		console.log('[font] ensureFontsReady done')
	})()

	return fontsReadyPromise
}