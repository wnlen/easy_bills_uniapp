// src/store/vuex.mixin.js
import { mapState } from 'vuex'
import store from '@/store'

let $uStoreKey = []
try {
  $uStoreKey = store.state ? Object.keys(store.state) : []
} catch (e) {}

export default {
  computed: {
    ...mapState($uStoreKey)
  }
}