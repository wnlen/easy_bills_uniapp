// common/plugins/index.js
import globalPlugin from './global.js'
import pushPlugin from './push.js'
import refreshPlugin from './refresh.js';
import univerifyPlugin from './univerify.js';

export default {
	install(app) {
		app.use(globalPlugin)
		app.use(pushPlugin)
		app.use(refreshPlugin)
		app.use(univerifyPlugin)
	}
}