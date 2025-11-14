/**隐私授权弹窗全局调用，agree同意或者已同意过（不需要弹窗）回调，disagree不同意回调,complete:所有情况都走该回调
 * this.$privacyCheck({
	 agree:()=>{},
	 disAgree:()=>{},
	 complete:()=>{}
 })
 */
const privacyCheck = (options = {}) => {
	const pages = getCurrentPages();
	let curPage = pages[pages.length - 1];//当前页面
	curPage.$vm.$refs.privacyDialog.check(options)

}

export default privacyCheck