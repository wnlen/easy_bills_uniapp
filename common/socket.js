import Vue from 'vue'
 
const SocketPlugin = {
  install(Vue, options) {
    const socket = Vue.prototype.$socket = {
      connect(url) {
        uni.connectSocket({
          url: url,
          complete: () => {}
        })
      },
      send(data) {
        uni.sendSocketMessage({
          data: data,
          fail: () => {}
        })
      },
      close() {
        uni.closeSocket()
      }
    }
 
    Vue.mixin({
      created() {
        if (typeof this.$options.socket === 'object') {
          this.$options.socket.connect()
        }
      },
      methods: {
        send(data) {
          socket.send(data)
        }
      }
    })
  }
}
 
Vue.use(SocketPlugin)