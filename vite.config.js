import { defineConfig } from 'vite';
import uni from '@dcloudio/vite-plugin-uni';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
	plugins: [
		uni(),
		visualizer({
			open: false, // 设置为 true 会自动打开浏览器查看打包分析图
			filename: 'dist/stats.html',
			gzipSize: true,
			brotliSize: true
		})
	],

	css: {
		preprocessorOptions: {
			scss: {
				silenceDeprecations: ['legacy-js-api', 'color-functions', 'import']
			}
		}
	},

	server: {
		port: 5100,
		fs: {
			allow: ['..']
		}
	},

	build: {
		minify: 'terser', // ✅ 显式启用 terser，否则 terserOptions 不生效
		sourcemap: false, // ✅ 避免 html2canvas.min.js 报错
		terserOptions: {
			compress: true,
			format: {
				comments: false
			}
		},
		rollupOptions: {
			external: [
				// 如果还有其它无法解析的 node 模块可手动排除，例如：
				// 'dayjs/esm/index'  // 可选
			]
		}
	}
});
