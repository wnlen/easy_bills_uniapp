<template>
	<view class="page-container">
		<view class="return_icon" @click="return_page">
			<uv-icon name="arrow-left" size="18" color="#333333"></uv-icon>
		</view>
		<view class="top-img">
			<image class="banner" src="https://res-oss.elist.com.cn/advertising/wenjuan_backgroundT.png" mode="widthFix"></image>
		</view>
		<view class="page-list">
			<view class="list-item" v-for="(q_item, q_index) in survey_data.questions" :key="q_index">
				<text v-if="q_item.isRequired" class="item-title-required">*</text>
				<text class="item-title">
					<text v-show="q_index < 9">0</text>
					<text>{{ q_index + 1 }} {{ q_item.title }}</text>
				</text>
				<text class="item-title-type" v-if="q_item.type == 'single' || q_item.type == 'multi'">({{ getStatusText(q_item.type) }})</text>
				<view class="list-item-radio" v-if="q_item.type == 'single'">
					<up-radio-group v-model="FormData[q_item.id].o_id" active-color="#ff9900" shape="square" :wrap="true" size="17" placement="column">
						<up-radio
							v-for="(o_item, o_index) in q_item.options"
							:key="o_item.id"
							:label="o_item.content"
							:name="o_item.id"
							:customStyle="{ marginBottom: '0rpx' }"
							@change="
								radioChange({
									q_id: q_item.id,
									o_id: o_item.id,
									content: o_item.content
								})
							"
						>
							{{ o_item.content }}
						</up-radio>
					</up-radio-group>

					<view v-show="FormData[q_item.id].is_qita">
						<up-input
							v-model="FormData[q_item.id].content"
							placeholder="填写更多答案"
							type="textarea"
							:field-style="field_style"
							:border-bottom="false"
							label-width="0"
						></up-input>
					</view>
				</view>
				<view class="list-item-radio" v-if="q_item.type == 'multi'">
					<uv-checkbox-group
						v-model="FormData[q_item.id].o_ids"
						activeColor="#ff9900"
						shape="square"
						size="17"
						placement="column"
						@change="(val) => onCheckboxGroupChange(q_item.id, val)"
					>
						<uv-checkbox
							:customStyle="{ marginBottom: '24rpx', marginTop: '10rpx' }"
							v-for="(o_item, o_index) in q_item.options"
							:key="o_item.id"
							:label="o_item.content"
							:name="o_item.id"
							labelSize="15"
							labelColor="#606266"
						></uv-checkbox>
					</uv-checkbox-group>

					<view class="" v-show="FormData[q_item.id].is_qita">
						<!-- <up-input
							v-model="FormData[q_item.id].content"
							placeholder="填写更多答案"
							type="textarea"
							:field-style="field_style"
							:border-bottom="false"
							label-width="0"
						></up-input> -->
						<up-textarea v-model="FormData[q_item.id].content" placeholder="填写更多答案"></up-textarea>
					</view>
				</view>
				<view v-if="q_item.type == 'text'">
					<!-- <up-input
						v-model="FormData[q_item.id].content"
						placeholder="填写更多答案"
						type="textarea"
						:field-style="field_style"
						:border-bottom="false"
						label-width="0"
					></up-input> -->
					<up-textarea v-model="FormData[q_item.id].content" placeholder="填写更多答案" :customStyle="{ marginTop: '20rpx' }"></up-textarea>
				</view>
			</view>
			<view class="Note">注：仅可领取一次，主体下多成员的累积领取至多四次</view>
			<view class="btn_submit">
				<wd-button type="warning"  @click="submit" :customStyle="btn_submitStyle">提交</wd-button>
			</view>
			<up-toast ref="uToast1" />
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			surveyId: 1, //问卷id
			i_type: 'text',
			survey_data: {},
			aaaa: true,
			STATUS_MAP: {
				single: '单选',
				multi: '可多选'
				// 'text': "填空",
				// 'rate': "评价",
				// 'date': "日期",
				// 'dropdown': "下拉"
			},
			qita_status: {
				id: 0,
				val: false
			},
			FormData: {},
			field_style: {
				border: '2rpx solid #D5D5D5',
				borderRadius: '12rpx',
				padding: '14rpx 30rpx'
			},
			btn_submitStyle: {
				height: '96rpx',
				lineHeight: '96rpx',
				width: '70%',
				fontSize: '38rpx'
			}
		};
	},
	onLoad(item) {
		this.getData();
	},
	methods: {
		/**
		 * 获取问卷数据
		 */
		getData() {
			uni.$api.survey
				.getSurveyList({
					surveyId: this.surveyId
				})
				.then((res) => {
					if (res.data.code === 200) {
						this.survey_data = res.data.data;
						console.log('this.survey_data', this.survey_data);

						//初始化表单数据
						const questions = res.data.data.questions;

						questions.forEach((q) => {
							this.$set(this.FormData, q.id, {
								isRequired: q.isRequired,
								o_id: '', // 单选时用
								o_ids: [], // 多选时用，存 content（题目选项名称）
								content: '', // 填空或“其他”补充内容
								contents: [],
								is_qita: false
							});
						});
					}
				});
		},
		submit() {
			// 校验表单完整性
			for (const [q_id, value] of Object.entries(this.FormData)) {
				const isEmptySelect = !value.o_id && (!value.o_ids || value.o_ids.length === 0);
				const isEmptyText = !value.content && !value.qita_content;
				if (value.isRequired && isEmptySelect && isEmptyText) {
					this.$refs.uToast1.show({
						message: '请填写完整信息',
						type: 'warning'
					});
					return; // 阻止提交
				}
			}

			const data = {
				id: this.surveyId,
				answers: []
			};

			for (const questionId in this.FormData) {
				const formItem = this.FormData[questionId];

				if (!Array.isArray(formItem.o_ids)) formItem.o_ids = [];
				if (!Array.isArray(formItem.contents)) formItem.contents = [];

				let optionIds = '';
				let answerText = '';

				if (formItem.o_ids && formItem.o_ids.length > 0) {
					optionIds = formItem.o_ids.join(',');

					const allContents = [...(formItem.contents || [])];
					if (formItem.is_qita && formItem.content) {
						allContents.push(formItem.content);
					}

					answerText = allContents.join(',');
				} else {
					optionIds = formItem.o_id || '';
					answerText = formItem.content || '';
				}

				data.answers.push({
					questionId: Number(questionId),
					optionIds,
					answerText
				});
			}
			console.log('发起提交', data);

			// 发起提交
			uni.$api.survey
				.submitSurvey(data)
				.then((res) => {
					console.log('提交响应:', res);

					this.$refs.uToast1.show({
						message: '提交成功，奖励已发放！',
						type: 'success'
					});
					setTimeout(() => {
						uni.switchTab({
							url: '/pages/index/index'
						});
					}, 1500);
				})
				.catch((res) => {
					const { code, message } = res.data;
					this.$refs.uToast1.show({
						message: message || '提交失败',
						type: 'warning'
					});
					setTimeout(() => {
						uni.switchTab({
							url: '/pages/index/index'
						});
					}, 1500);
				});
		},
		//类型映射
		getStatusText(status) {
			return this.STATUS_MAP[status] || '';
		},
		radioChange(n) {
			console.log('n', n);
			this.FormData[n.q_id].o_id = n.o_id;
			if (n.content == '其他') {
				this.$set(this.FormData[n.q_id], 'is_qita', true);
				this.FormData[n.q_id].content = '';
			} else {
				this.$set(this.FormData[n.q_id], 'is_qita', false);
				console.log('Change', n);
				this.FormData[n.q_id].content = n.content;
			}
			console.log('this.FormData[n.q_id].is_qita', this.FormData);
		},
		onCheckboxGroupChange(q_id, selectedIds) {
			const form = this.FormData[q_id];
			const question = this.survey_data.questions.find((q) => q.id === q_id);

			// 创建 id -> content 映射
			const idToContentMap = {};
			question.options.forEach((opt) => {
				idToContentMap[opt.id] = opt.content;
			});

			// 更新 o_ids 和 contents
			form.o_ids = selectedIds;
			form.contents = selectedIds.map((id) => idToContentMap[id]);

			form.is_qita = form.contents.includes('其他');
			if (!form.is_qita) {
				form.content = ''; // 取消“其他”时清空补充输入
			}
		},
		return_page() {
			uni.navigateBack({
				delta: 1 // 返回的页面层数，默认是1
			});
		}
	}
};
</script>

<style>
.page-container {
	display: flex;
	flex-direction: column;
	min-height: 100vh;
	background-color: #f5f5f5;
}
.return_icon {
	position: absolute;
	top: 80rpx;
	left: 20rpx;
}

/* 顶部图片区域 */
.top-img {
	width: 100%;
	overflow: hidden;
}

.banner {
	width: 100%;
	height: 100%;
	object-fit: cover;
}

/* 列表区域 */
.page-list {
	position: relative;
	top: -160rpx;
	padding: 10rpx 10rpx;
	box-sizing: border-box;
	border-radius: 15rpx;
	margin: 10rpx 20rpx;
}

.list-item {
	position: relative;
	background-color: #ffffff;
	padding: 25rpx 30rpx;
	margin-bottom: 20rpx;
	border-radius: 16rpx;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

.item-title-required {
	position: absolute;
	font-size: 27rpx;
	color: red;
	left: 10rpx;
}

.item-title {
	font-size: 32rpx;
	color: #333333;
}

.item-title-type {
	font-size: 32rpx;
	color: #ffa54c;
}

.list-item-radio {
	margin-left: 10rpx;
	margin-top: 15rpx;
}

.Note {
	font-size: 22rpx;
	color: #999999;
	margin-left: 20rpx;
}

.btn_submit {
	width: 100%;
	text-align: center;
	margin: 80rpx 0;
}
</style>
