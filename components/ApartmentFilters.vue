<template>
    <aside class="apartments__filters">
        <section class="apartments__filter apartments__filter--rooms">
            <div class="apartments__rooms">
                <button type="button" class="apartments__room-btn" data-rooms="1">1к</button>
                <button type="button" class="apartments__room-btn active" data-rooms="2">2к</button>
                <button type="button" class="apartments__room-btn" data-rooms="3">3к</button>
                <button type="button" class="apartments__room-btn" data-rooms="4" disabled>4к</button>
            </div>
        </section>

        <section class="apartments__filter apartments__filter--price">
            <h2 class="apartments__filter-title">Стоимость квартиры, ₽</h2>
            <div class="apartments__range-values">
                <span class="apartments__range-value" id="price-min">от <span class="value">3 000 000</span></span>
                <span class="apartments__range-value" id="price-max">до <span class="value">12 000 000</span></span>
            </div>
            <div class="apartments__range-slider">
                <VueSlider :process-style="{ backgroundColor: '#2ecc71', height: '3px' }"
                    :rail-style="{ height: '3px' }"
                    :tooltip-style="{ backgroundColor: '#2ecc71', color: 'white', fontWeight: '500' }"
                    :dot-style="{ backgroundColor: '#2ecc71', boxShadow: 'none' }" class="apartments__range"
                    v-model="priceRange" />
            </div>
        </section>

        <section class="apartments__filter apartments__filter--area">
            <h2 class="apartments__filter-title">Площадь, м²</h2>
            <div class="apartments__range-values">
                <span class="apartments__range-value" id="area-min">от <span class="value">30</span></span>
                <span class="apartments__range-value" id="area-max">до <span class="value">400</span></span>
            </div>
            <div class="apartments__range-slider">
                <VueSlider :process-style="{ backgroundColor: '#2ecc71', height: '3px' }"
                    :rail-style="{ height: '3px' }"
                    :tooltip-style="{ backgroundColor: '#2ecc71', color: 'white', fontWeight: '500' }"
                    :dot-style="{ backgroundColor: '#2ecc71', boxShadow: 'none' }" class="apartments__range"
                    v-model="areaRange" />
            </div>
        </section>

        <button type="button" class="apartments__reset-btn">Сбросить параметры
           <SvgoIcon class="apartments__reset-btn-icon" name="close" />
          </button>
    </aside>
</template>
<script setup lang="ts">
import VueSlider from "vue-3-slider-component";
const priceRange = ref([3000000, 12000000])
const areaRange = ref([30, 120])
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
            background-color: darken(#95D0A1, 16%)
          @media (hover: hover) and (pointer: fine)
            &:not(:disabled):not(.active):hover
              background-color: darken(#95D0A1, 8%)
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

      .apartments__range-slider

        .apartments__range
            

.apartments__reset-btn
  background: transparent
  border: none
  font-size: 14px
  margin-right: auto
  width: fit-content
  display: flex
  align-items: center
  cursor: pointer
  padding: 10px 0
  @media (max-width: 960px)
    font-size: 13px

  &:hover
    color: #2ecc71
    .apartments__reset-btn-icon
      transform: rotate(-20deg) translateX(-2px)
      color: #2ecc71

  &:disabled
    opacity: 0.7
    cursor: not-allowed

  .apartments__reset-btn-icon
    width: 8px
    height: 8px
    margin-left: 5px
    transition: transform 0.2s ease-in-out
</style>