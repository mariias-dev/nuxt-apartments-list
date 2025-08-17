<template>
  <aside class="apartments__filters">
    <section class="apartments__filter apartments__filter--rooms">
      <div class="apartments__rooms">
        <button v-for="n in availableRooms" :key="n" type="button" class="apartments__room-btn"
          :class="{ active: filters.rooms.includes(n) }" @click="toggleRoom(n)">
          {{ n }}к
        </button>
      </div>
    </section>

    <section class="apartments__filter apartments__filter--price">
      <h2 class="apartments__filter-title">Стоимость квартиры, ₽</h2>
      <div class="apartments__range-values">
        <span class="apartments__range-value" id="price-min">от {{ formatNumber(priceRange[0]) }}</span>
        <span class="apartments__range-value" id="price-max"> до {{ formatNumber(priceRange[1]) }}</span>
      </div>
      <div class="apartments__range-slider">
        <VueSlider v-if="slidersReady && stats" v-model="priceRange" :disabled="priceBounds[0] === priceBounds[1]"
          :min="priceBounds[0]" :max="priceBounds[1]" :interval="priceInterval" :tooltip-formatter="formatPriceTooltip"
          :dot-style="{ backgroundColor: '#2ecc71', boxShadow: 'none' }" class="apartments__range"
          :process-style="{ backgroundColor: '#2ecc71', height: '3px' }" :rail-style="{ height: '3px' }"
          :tooltip-style="{ backgroundColor: '#2ecc71', color: 'white', fontWeight: '500' }"
          @change="handlePriceChange" />
      </div>
    </section>

    <section class="apartments__filter apartments__filter--area">
      <h2 class="apartments__filter-title">Площадь, м²</h2>
      <div class="apartments__range-values">
        <span class="apartments__range-value" id="area-min">от {{ areaRange[0] }}</span>
        <span class="apartments__range-value" id="area-max">до {{ areaRange[1] }}</span>
      </div>
      <div class="apartments__range-slider">
        <VueSlider v-if="slidersReady && stats" v-model="areaRange" :disabled="areaBounds[0] === areaBounds[1]"
          :min="areaBounds[0]" :max="areaBounds[1]" :interval="areaInterval"
          :process-style="{ backgroundColor: '#2ecc71', height: '3px' }" :rail-style="{ height: '3px' }"
          :dot-style="{ backgroundColor: '#2ecc71', boxShadow: 'none' }" class="apartments__range"
          :tooltip-style="{ backgroundColor: '#2ecc71', color: 'white', fontWeight: '500' }"
          @change="handleAreaChange" />
      </div>
    </section>

    <button type="button" class="apartments__reset-btn" @click="resetFilters" :disabled="!hasActiveFilters">
      Сбросить параметры
      <SvgoIcon class="apartments__reset-btn-icon" name="close" />
    </button>
  </aside>
</template>

<script setup lang="ts">
import VueSlider from "vue-3-slider-component"
import { computed, watch, ref, onMounted } from 'vue'
import { useApartmentsStore } from '@/stores/apartments'
import { storeToRefs } from 'pinia'

const store = useApartmentsStore()
const { stats, filters } = storeToRefs(store)

const priceRange = ref<[number, number]>([0, 0])
const priceBounds = ref<[number, number]>([0, 0])

const areaRange = ref<[number, number]>([0, 0])
const areaBounds = ref<[number, number]>([0, 0])
const priceInterval = computed(() => 1000)
const areaInterval = computed(() => 0.1)

watch(() => stats.value, (newStats) => updateSliderValues(newStats), { immediate: true })

function updateSliderValues(newStats = stats.value) {
  if (!newStats) return

  priceRange.value = [
    Math.max(newStats.minPrice, filters.value.minPrice ?? newStats.minPrice),
    Math.min(newStats.maxPrice, filters.value.maxPrice ?? newStats.maxPrice)
  ]

  areaRange.value = [
    Math.max(newStats.minArea, filters.value.minArea ?? newStats.minArea),
    Math.min(newStats.maxArea, filters.value.maxArea ?? newStats.maxArea)
  ]

  priceBounds.value = [newStats.minPrice, newStats.maxPrice]
  areaBounds.value = [newStats.minArea, newStats.maxArea]
  slidersReady.value = true
}

const availableRooms = computed(() => {
  return stats.value?.availableRooms || []
})

const hasActiveFilters = computed(() => {
  return (
    filters.value.rooms.length > 0 ||
    filters.value.minPrice !== undefined ||
    filters.value.maxPrice !== undefined ||
    filters.value.minArea !== undefined ||
    filters.value.maxArea !== undefined
  )
})

const slidersReady = ref(false)

const formatNumber = (value: number) => {
  return new Intl.NumberFormat('ru-RU').format(value)
}

const formatPriceTooltip = (value: number) => {
  return `${formatNumber(value)} ₽`
}

const toggleRoom = (n: number) => {
  const rooms = new Set(filters.value.rooms)
  if (rooms.has(n)) {
    rooms.delete(n)
  } else {
    rooms.add(n)
  }
  
  filters.value.rooms = Array.from(rooms)
  store.fetchApartments()
}

let priceTimer: number | undefined
let areaTimer: number | undefined

const handlePriceChange = ([min, max]: [number, number]) => {
  filters.value.minPrice = min === stats.value?.minPrice ? undefined : min
  filters.value.maxPrice = max === stats.value?.maxPrice ? undefined : max

  priceRange.value = [min, max]

  if (priceTimer) clearTimeout(priceTimer)
  priceTimer = window.setTimeout(() => {
    store.fetchApartments()
  }, 500)
}

const handleAreaChange = ([min, max]: [number, number]) => {
  filters.value.minArea = min === stats.value?.minArea ? undefined : min
  filters.value.maxArea = max === stats.value?.maxArea ? undefined : max

  areaRange.value = [min, max]

  if (areaTimer) clearTimeout(areaTimer)
  areaTimer = window.setTimeout(() => {
    store.fetchApartments()
  }, 500)
}

const resetFilters = () => {
  store.resetFilters()
}

onMounted(() => {
  if (stats.value) {
    slidersReady.value = true
  }
})
</script>

<style scoped lang="sass">
.apartments__filters
  width: 37%
  display: flex
  flex-direction: column
  background: linear-gradient(135deg, rgba(174, 228, 178, 0.3) 0%, rgba(149, 208, 161, 0.3) 100%)
  height: fit-content
  padding: 40px
  border-radius: 10px
  gap: 24px

  @media (max-width: 960px)
    padding: 20px

  @media (max-width: 768px)
    width: 100%
    

  .apartments__filter
    display: flex
    flex-direction: column
    gap: 8px

    &--rooms
      .apartments__rooms
        display: flex
        gap: 16px

        .apartments__room-btn
          height: 44px
          width: 44px
          border-radius: 100%
          transition: all 0.2s ease-in-out
          background-color: white
          border: none
          &:active
            background-color: #7DAE87
          @media (hover: hover) and (pointer: fine)
            &:not(:disabled):not(.active):hover
              background-color: #89BF94
              cursor: pointer
          

          &.active
            background-color: #2ecc71
            color: white
            box-shadow: 0px 6px 20px 0px #95D0A1

          &:disabled
            opacity: 0.7
            cursor: not-allowed

    &--price,
    &--area
      .apartments__filter-title
        font-size: 14px
        font-weight: 400
        @media (max-width: 960px)
          font-size: 13px

      .apartments__range-values
        display: flex
        font-size: 16px
        @media (max-width: 960px)
          font-size: 14px

        .apartments__range-value
          width: 50%
          color: #7D7D7D
          .value
            color: black
            font-weight: 500
            margin-left: 5px
            

.apartments__reset-btn
  background: transparent
  border: none
  font-size: 14px
  margin-right: auto
  width: fit-content
  cursor: pointer
  padding: 10px 0
  color: inherit
  transition: color 0.2s ease-in-out
  margin-left: 10px

  @media (max-width: 960px)
    font-size: 13px
  &:not(:disabled):hover
    .apartments__reset-btn-icon
      transform: rotate(-20deg) translateX(-2px)

  &:disabled
    opacity: 0.5
    cursor: not-allowed

  .apartments__reset-btn-icon
    width: 8px
    height: 8px
    margin-left: 3px
    transition: transform 0.2s ease-in-out, color 0.2s ease-in-out
</style>