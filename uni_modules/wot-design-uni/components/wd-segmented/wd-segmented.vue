<template>
  <view :class="`wd-segmented ${customClass}`" :style="customStyle">
    <view
      :class="`wd-segmented__item is-${size} ${state.activeIndex === index ? 'is-active' : ''} ${
        disabled || (isObj(option) ? option.disabled : false) ? 'is-disabled' : ''
      }`"
      @click="handleClick(option, index)"
      v-for="(option, index) in options"
      :key="index"
    >
      <view class="wd-segmented__item-label">
        <slot name="label" v-if="$slots.label" :option="isObj(option) ? option : { value: option }"></slot>
        <template v-else>
          {{ isObj(option) ? option.value : option }}
        </template>
      </view>
    </view>
    <view :class="`wd-segmented__item--active ${activeDisabled ? 'is-disabled' : ''}`" :style="state.activeStyle"></view>
  </view>
</template>

<script lang="ts">
export default {
  name: 'wd-segmented',
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: 'shared'
  }
}
</script>

<script setup lang="ts">
import { computed, getCurrentInstance, onMounted, reactive, watch } from 'vue'
import { getRect, isObj, objToStyle, addUnit, pause } from '../common/util'
import type { CSSProperties } from 'vue'
import { segmentedProps, type SegmentedExpose, type SegmentedOption } from './types'
const $item = '.wd-segmented__item'

const props = defineProps(segmentedProps)
const emit = defineEmits(['update:value', 'change', 'click'])

const state = reactive({
  activeIndex: 0, // 选中项
  activeStyle: '' // 选中样式
})

const activeDisabled = computed(() => {
  return props.disabled || (props.options[0] && isObj(props.options[0]) ? props.options[0].disabled : false)
})

const { proxy } = getCurrentInstance() as any

// ★ 改动 1：只有索引真的变化才更新样式，避免回写-监听循环
watch(
  () => props.value,
  () => {
    const prev = state.activeIndex
    updateCurrentIndex()
    if (state.activeIndex !== prev) {
      updateActiveStyle()
      if (props.vibrateShort) uni.vibrateShort({})
    }
  },
  { immediate: false }
)

onMounted(async () => {
  updateCurrentIndex()
  await pause()
  await measureOnce()
  updateActiveStyle(false)
})

watch(() => props.options.length, async () => {
  await measureOnce()
  updateActiveStyle(false)
})

/**
 * 更新滑块偏移量
 */
function updateActiveStyle(animation: boolean = true, targetIndex?: number) {
  // 优先使用缓存（同步），确保同一帧就能移动
  const idx = targetIndex ?? state.activeIndex
  const w = cachedRects[idx]?.width
  const l = lefts[idx]

  if (w != null && l != null) {
    const style: CSSProperties = {
      position: 'absolute',
      width: addUnit(w),
      transform: `translate3d(${l}px,0,0)`,
      'z-index': 0,
      transition: animation ? 'transform 0.12s cubic-bezier(0.645,0.045,0.355,1)' : undefined
    }
    state.activeStyle = objToStyle(style)
    return
  }

  // 兜底：若缓存尚未就绪（极少数情况），退回一次异步测量
  getRect($item, true, proxy).then((rects) => {
    const rect = rects[idx]
    const left = rects.slice(0, idx).reduce((prev, curr) => prev + Number(curr.width), 0)
    const style: CSSProperties = {
      position: 'absolute',
      width: addUnit(rect.width!),
      transform: `translate3d(${left}px,0,0)`,
      'z-index': 0,
      transition: animation ? 'transform 0.12s cubic-bezier(0.645,0.045,0.355,1)' : undefined
    }
    state.activeStyle = objToStyle(style)
  })
}

// === 缓存：项宽与累计偏移 ===
let cachedRects: Array<{ width: number }> = []
let lefts: number[] = []

async function measureOnce() {
  const rects = await getRect($item, true, proxy)
  cachedRects = (rects || []).map((r: any) => ({ width: Number(r.width) || 0 }))
  lefts = cachedRects.map((_, i) => cachedRects.slice(0, i).reduce((sum, r) => sum + r.width, 0))
}

/**
 * 更新当前下标
 */
function updateCurrentIndex() {
  const index = props.options.findIndex((option: string | number | SegmentedOption) => {
    const value = isObj(option) ? option.value : option
    return value == props.value
  })
  if (index >= 0) {
    state.activeIndex = index
  } 
  // ★ 改动 3：删除这段自动回写，防止形成“设置->监听->再设置”的死循环
  // else {
  //   const value = isObj(props.options[0]) ? props.options[0].value : props.options[0]
  //   emit('update:value', value)
  //   emit('change', isObj(props.options[0]) ? props.options[0] : { value })
  // }
}

function handleClick(option: string | number | SegmentedOption, index: number) {
  const disabled = props.disabled || (isObj(option) ? option.disabled : false)
  if (disabled) return
  if (index === state.activeIndex) return // ★ 改动 4：点当前项直接返回，避免重复触发

  const value = isObj(option) ? option.value : option
  state.activeIndex = index
  updateActiveStyle()
  emit('update:value', value)
  emit('change', isObj(option) ? option : { value })
  emit('click', isObj(option) ? option : { value })
}

defineExpose<SegmentedExpose>({
  updateActiveStyle
})
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>