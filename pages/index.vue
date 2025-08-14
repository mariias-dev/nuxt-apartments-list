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
        Загрузить еще
      </button>
    </div>

  <ApartmentFilters></ApartmentFilters>
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
import ApartmentFilters from '~/components/ApartmentFilters.vue'

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
      @media (min-width: 768px) and (max-width: 960px)
        padding-left: 0
      @media (max-width: 768px)
        width: 33%

    .apartments__col--floor
      width: 17%
      @media (max-width: 768px)
        width: 33%

    .apartments__col--price
      width: 17%
      @media (max-width: 768px)
        width: 33%

  &__title
    margin-bottom: 48px
    @media (max-width: 960px)
      margin-bottom: 24px
    @media (max-width: 768px)
      text-align: center
      margin-bottom: 16px

  &__list
    flex: 1

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
      height: 30px

@media (max-width: 768px)
  .apartments
    flex-direction: column-reverse

</style>
