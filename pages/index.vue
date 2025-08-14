<template>
  <section class="apartments">
    <div class="apartments__list">
      <h1 class="apartments__title">Квартиры</h1>

      <header class="apartments__header">
        <span class="apartments__col apartments__col--layout">Планировка</span>
        <span class="apartments__col apartments__col--type">Квартира</span>
        <span class="apartments__col apartments__col--area">S, м²</span>
        <span class="apartments__col apartments__col--floor">Этаж</span>
        <span class="apartments__col apartments__col--price">Цена, ₽</span>
      </header>

      <ul class="apartments__items">
        <ApartmentCard v-for="apartment in apartments" :key="apartment.id" :apartment="apartment" />
      </ul>

      <button class="apartments__more" type="button">
        Показать ещё
      </button>
    </div>

    <aside class="apartments__filters">
      <section class="apartments__filter apartments__filter--rooms">
        <h2 class="apartments__filter-title">Комнаты</h2>
        <div class="apartments__rooms">
          <button type="button" class="apartments__room-btn" data-rooms="1">1</button>
          <button type="button" class="apartments__room-btn" data-rooms="2">2</button>
          <button type="button" class="apartments__room-btn" data-rooms="3">3</button>
          <button type="button" class="apartments__room-btn" data-rooms="4">4</button>
        </div>
      </section>

      <section class="apartments__filter apartments__filter--price">
        <h2 class="apartments__filter-title">Стоимость квартиры, ₽</h2>
        <div class="apartments__range-values">
          <span class="apartments__range-value" id="price-min">3 000 000</span>
          <span class="apartments__range-separator">–</span>
          <span class="apartments__range-value" id="price-max">12 000 000</span>
        </div>
        <div class="apartments__range-slider">
          <input type="range" class="apartments__range apartments__range--min" min="3000000" max="12000000"
            step="100000" aria-labelledby="price-min" />
          <input type="range" class="apartments__range apartments__range--max" min="3000000" max="12000000"
            step="100000" aria-labelledby="price-max" />
        </div>
      </section>

      <section class="apartments__filter apartments__filter--area">
        <h2 class="apartments__filter-title">Площадь, м²</h2>
        <div class="apartments__range-values">
          <span class="apartments__range-value" id="area-min">30</span>
          <span class="apartments__range-separator">–</span>
          <span class="apartments__range-value" id="area-max">120</span>
        </div>
        <div class="apartments__range-slider">
          <input type="range" class="apartments__range apartments__range--min" min="30" max="120" step="1"
            aria-labelledby="area-min" />
          <input type="range" class="apartments__range apartments__range--max" min="30" max="120" step="1"
            aria-labelledby="area-max" />
        </div>
      </section>

      <button type="button" class="apartments__reset-btn">Сбросить параметры</button>
    </aside>
  </section>
</template>

<script setup lang="ts">
interface Apartment {
  id: number
  plan: string
  type: string
  area: number
  floor: number
  totalFloors: number
  price: number
}

import { ref, onMounted } from 'vue'

const apartments = ref<Apartment[]>([])

onMounted(async () => {
  const res = await fetch('/data/apartments.json')
  apartments.value = await res.json()
})
</script>

<style scoped lang="sass">
.apartments
  display: flex
  gap: 80px
  @media (max-width: 960px)
    gap: 28px

  &__header
    display: flex
    font-size: 14px

    .apartments__col
      flex-shrink: 0
      padding: 0 10px
      height: 20px
      margin-bottom: 16px
      @media (max-width: 960px)
        margin: 8px 0

    .apartments__col:first-child
      padding-left: 0

    .apartments__col:last-child
      padding-right: 0

    .apartments__col--layout
      width: fit-content
      @media (max-width: 960px)
        display: none

    .apartments__col--type
      flex: 1
      @media (max-width: 960px)
        display: none

    .apartments__col--area
      width: 17%
      @media (max-width: 960px)
        padding-left: 0

    .apartments__col--floor
      width: 17%

    .apartments__col--price
      width: 17%

  &__title
    margin-bottom: 48px
    @media (max-width: 960px)
      margin-bottom: 24px
    @media (max-width: 768px)
      text-align: center
      margin-bottom: 16px

  &__list
    flex: 1

  &__filters
    width: 37%
    @media (max-width: 768px)
      width: 100%
      margin-top: 2rem

  &__more
    height: 40px
    width: 156px
    border-radius: 25px
    cursor: pointer
    transition: background-color 0.2s ease-in-out
    border: 1px solid #0B173933
    background: transparent
    margin-top: 48px
    @media (max-width: 960px)
      margin-top: 24px

    &:hover
      background-color: #AEE4B2
    @media (max-width: 768px)
      width: 100%
      text-align: center

@media (max-width: 768px)
  .apartments
    flex-direction: column-reverse

</style>
