<template>
  <div 
    ref="scrollContainer"
    class="virtual-scroll-container"
    @scroll="handleScroll"
    :style="containerStyle"
  >
    <!-- Spacer for total height -->
    <div :style="{ height: totalHeight + 'px' }"></div>
    
    <!-- Visible items -->
    <div
      class="virtual-scroll-viewport"
      :style="viewportStyle"
    >
      <div
        v-for="item in visibleItems"
        :key="getItemKey(item)"
        class="virtual-scroll-item"
        :style="{ height: itemHeight + 'px' }"
      >
        <slot :item="item" :index="getItemIndex(item)">
          {{ item }}
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { debounce } from 'lodash-es'

interface Props {
  items: any[]
  itemHeight?: number
  height?: number | string
  buffer?: number
  keyField?: string
  preload?: number
}

const props = withDefaults(defineProps<Props>(), {
  itemHeight: 80,
  height: 600,
  buffer: 5,
  keyField: 'id',
  preload: 20
})

const emit = defineEmits<{
  'scroll-end': []
  'scroll-start': []
  'visible-items-change': [items: any[]]
}>()

// Refs
const scrollContainer = ref<HTMLElement>()
const scrollTop = ref(0)
const isScrolling = ref(false)

// Computed
const totalHeight = computed(() => props.items.length * props.itemHeight)

const containerStyle = computed(() => ({
  height: typeof props.height === 'number' ? `${props.height}px` : props.height,
  overflow: 'auto',
  position: 'relative' as const
}))

const visibleRange = computed(() => {
  const containerHeight = typeof props.height === 'number' ? props.height : 600
  const visibleCount = Math.ceil(containerHeight / props.itemHeight)
  const startIndex = Math.max(0, Math.floor(scrollTop.value / props.itemHeight) - props.buffer)
  const endIndex = Math.min(
    props.items.length,
    startIndex + visibleCount + props.buffer * 2
  )
  
  return { startIndex, endIndex, visibleCount }
})

const visibleItems = computed(() => {
  const { startIndex, endIndex } = visibleRange.value
  return props.items.slice(startIndex, endIndex)
})

const viewportStyle = computed(() => ({
  position: 'absolute' as const,
  top: `${visibleRange.value.startIndex * props.itemHeight}px`,
  left: 0,
  right: 0
}))

// Methods
const getItemKey = (item: any) => {
  if (typeof item === 'object' && item !== null) {
    return item[props.keyField] || JSON.stringify(item)
  }
  return item
}

const getItemIndex = (item: any) => {
  return props.items.indexOf(item)
}

const handleScroll = () => {
  if (!scrollContainer.value) return
  
  scrollTop.value = scrollContainer.value.scrollTop
  isScrolling.value = true
  
  // Check if reached end
  const { scrollHeight, clientHeight } = scrollContainer.value
  if (scrollTop.value + clientHeight >= scrollHeight - props.preload) {
    emit('scroll-end')
  }
  
  // Check if at start
  if (scrollTop.value <= props.preload) {
    emit('scroll-start')
  }
  
  debouncedScrollEnd()
}

const debouncedScrollEnd = debounce(() => {
  isScrolling.value = false
}, 150)

const scrollToIndex = (index: number, behavior: ScrollBehavior = 'smooth') => {
  if (!scrollContainer.value) return
  
  const targetScrollTop = index * props.itemHeight
  scrollContainer.value.scrollTo({
    top: targetScrollTop,
    behavior
  })
}

const scrollToItem = (item: any, behavior: ScrollBehavior = 'smooth') => {
  const index = props.items.indexOf(item)
  if (index !== -1) {
    scrollToIndex(index, behavior)
  }
}

// Watch visible items changes
watch(visibleItems, (newItems) => {
  emit('visible-items-change', newItems)
})

// Handle window resize
const handleResize = debounce(() => {
  if (scrollContainer.value) {
    handleScroll()
  }
}, 100)

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

// Expose methods for parent components
defineExpose({
  scrollToIndex,
  scrollToItem,
  refresh: handleScroll
})
</script>

<style scoped>
.virtual-scroll-container {
  position: relative;
  overflow-y: auto;
  overflow-x: hidden;
}

.virtual-scroll-container::-webkit-scrollbar {
  width: 8px;
}

.virtual-scroll-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.virtual-scroll-container::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.virtual-scroll-container::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.virtual-scroll-viewport {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
}

.virtual-scroll-item {
  display: flex;
  align-items: center;
  box-sizing: border-box;
}
</style>