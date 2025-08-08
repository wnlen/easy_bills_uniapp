<template>
  <view class="pl48 pr48 pt38 pb38 vw100">
    <u-form
      class="vw100"
      :model="formData"
      ref="uForm"
      labelPosition="left"
      :label-style="{ 'line-height': 1 }"
      :error-type="['toast']"
    >
      <u-form-item
        label="签收人姓名"
        prop="signeeName"
        required
        label-width="170"
      >
        <u-input
          border="none"
          :modelValue="formData.signeeName"
          placeholder="请输入签收人姓名"
          maxlength="50"
        ></u-input>
      </u-form-item>
      <u-form-item label="签收密码" prop="password" required label-width="170">
        <u-input
          border="none"
          :modelValue="formData.password"
          type="number"
          placeholder="请设置密码"
          maxlength="4"
        ></u-input>
      </u-form-item>
      <!-- 			<u-form-item label="其他备注" prop="remark" label-width="170">
				<u-input border="none" :modelValue="formData.remark" placeholder="请输入备注" ></u-input>
			</u-form-item> -->
      <u-form-item
        label="手写签名"
        required
        prop="signeeImage"
        labelPosition="top"
        label-width="170"
      >
        <view
          v-if="formData.signeeImage"
          class="text-center width100"
          style="height: 50vw; border: 4rpx dashed #eee"
        >
          <image
            @click="goPath('/pages/subSignature/signature')"
            style="transform: rotate(-90deg); height: 50vw; width: 100%"
            :src="formData.signeeImage"
            mode="heightFix"
          ></image>
        </view>
        <view
          v-else
          class="bg-white pd20 text-center width100"
          @click="goPath('/pages/subSignature/signature')"
        >
          <u-icon label="点击去签名" name="edit-pen"></u-icon>
        </view>
      </u-form-item>
    </u-form>
    <view class="mt60">
      <u-button
        @click="submit"
        hover-class="none"
        :custom-style="{ backgroundColor: '#01BB74' }"
        shape="circle"
        type="primary"
        >{{ formData.id ? "修改" : "提交" }}</u-button
      >
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      formData: {
        id: "", //签收人记录ID，新增时此值传空
        signeeName: "", //签收人姓名
        phoneNumer: "",
        ifDefault: "N", //是否默认 Y | N
        signeeImage: "", //签名图
        remark: "",
        password: "",
      },
      switchVal: false,
      rules: {
        signeeName: [
          {
            required: true,
            message: "请输入签收人姓名",
            trigger: ["change", "blur"],
          },
          {
            min: 1,
            max: 50,
            message: "签收人姓名不能超过50个字",
            trigger: "change",
          },
        ],
        phoneNumer: [
          {
            required: true,
            message: "请输入手机号",
            trigger: ["change", "blur"],
          },
          {
            max: 11,
            message: "请输入手机号",
            trigger: ["change", "blur"],
          },
          {
            validator: (rule, value, callback) => {
              if (!value) return true;
              return this.$u.test.mobile(value);
            },
            message: "手机号码不正确",
            trigger: ["change", "blur"],
          },
        ],
      },
    };
  },
  onLoad(options) {
    if (options.item) {
      var json = JSON.parse(options.item);
      console.log(json);
      this.formData.id = json.id;
      this.formData.phoneNumer = json.phone;
      this.formData.signeeName = json.name;
      this.formData.signeeImage = json.signatureImg;
      this.formData.password = json.password;
      this.switchVal = this.formData.ifDefault == "Y" ? true : false;
    }
  },
  onShow() {
    // 获取签名图片
    let that = this;
    uni.$on("getSignImg", function (data) {
      that.$set(that.formData, "signeeImage", data);
    });
  },
  // 必须要在onReady生命周期，因为onLoad生命周期组件可能尚未创建完毕
  onReady() {
    this.$refs.uForm.setRules(this.rules);
  },
  methods: {
    loadData() {
      let role = this.vuex_user.data.work == "1" ? 1 : 2;
      console.log(this.vuex_user.data.work);
      var that = this;
      this.$api.user
        .refreshUser({
          phone: this.vuex_user.phone,
          role: role,
        })
        .then((res) => {
          let a = that.vuex_user;
          a.ac = res.data.data.ac;
          a.data = res.data.data.data;
          a.workData = res.data.data.workData;
          a.jurisdiction = res.data.data.jurisdiction;
          a.vuex_password = res.data.data.password;
          that.$u.vuex("vuex_user", a);
          if (res.data.data.data.work == "1") {
            that.$u.vuex("vuex_work", "Y");
          } else {
            that.$u.vuex("vuex_work", "N");
          }
        });

      console.log("用户信息实时更新 ", this.vuex_user);
    },
    switchChange(val) {
      console.log(val);
      this.formData.ifDefault = val ? "Y" : "N";
    },
    submit() {
      console.log(this.formData);

      if (this.formData.signeeImage.length == 0) {
        this.$u.toast("请绘制签名图片");
        return;
      }

      if (this.formData.password.length == 0) {
        this.$u.toast("请设置4位签名密码");
        return;
      }

      if (this.formData.password.length != 4) {
        this.$u.toast("请设置4位签名密码");
        return;
      }

      if (this.formData.signeeName.length == 0) {
        this.$u.toast("请设置签收姓名");
        return;
      }

      this.$refs.uForm.validate((valid) => {
        if (valid) {
          console.log(this.formData);
          var dx = {
            id: this.formData.id,
            name: this.formData.signeeName,
            phone: this.vuex_user.phone,
            signatureImg: this.formData.signeeImage,
            password: this.formData.password,
            state: "1",
          };
          this.$api.sign.addSignature(dx).then((res) => {
            this.$u.toast("保存成功～");
            setTimeout(() => {
              // this.loadData();
              uni.navigateBack({
                delta: 1,
              });
            }, 1500);
          });
        } else {
          console.log("验证失败");
        }
      });
    },
  },
};
</script>

<style lang="scss"></style>
