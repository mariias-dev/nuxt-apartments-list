<template>
  <section class="apartments">
    <div class="apartments__list">
      <h1 class="apartments__title">Квартиры</h1>
      <header class="apartments__header">
        <span class="apartments__col apartments__col--layout">Планировка</span>
        <span class="apartments__col apartments__col--type">Квартира</span>
        <span class="apartments__col apartments__col--area">Площадь</span>
        <span class="apartments__col apartments__col--floor">Этаж</span>
        <span class="apartments__col apartments__col--price">Цена</span>
      </header>
      <ul class="apartments__items">
        <ApartmentCard v-for="apartment in apartments" :key="apartment.id" :apartment="apartment" />
      </ul>
    </div>
    <aside class="filters">
      <section class="filters__section filters__section--rooms">
        <div class="filters__rooms">
          <button type="button" class="filters__room-btn" data-rooms="1">1</button>
          <button type="button" class="filters__room-btn" data-rooms="2">2</button>
          <button type="button" class="filters__room-btn" data-rooms="3">3</button>
          <button type="button" class="filters__room-btn" data-rooms="4">4</button>
        </div>
      </section>

      <section class="filters__section filters__section--price">
        <h2 class="filters__title">Стоимость квартиры, ₽</h2>
        <div class="filters__values">
          <span class="filters__value" id="price-min">3 000 000</span>
          <span class="filters__separator">–</span>
          <span class="filters__value" id="price-max">12 000 000</span>
        </div>
        <div class="filters__slider">
          <input type="range" class="filters__range filters__range--min" min="3000000" max="12000000" step="100000"
            aria-labelledby="price-min">
          <input type="range" class="filters__range filters__range--max" min="3000000" max="12000000" step="100000"
            aria-labelledby="price-max">
        </div>
      </section>

      <section class="filters__section filters__section--area">
        <h2 class="filters__title">Площадь, м²</h2>
        <div class="filters__values">
          <span class="filters__value" id="area-min">30</span>
          <span class="filters__separator">–</span>
          <span class="filters__value" id="area-max">120</span>
        </div>
        <div class="filters__slider">
          <input type="range" class="filters__range filters__range--min" min="30" max="120" step="1"
            aria-labelledby="area-min">
          <input type="range" class="filters__range filters__range--max" min="30" max="120" step="1"
            aria-labelledby="area-max">
        </div>
      </section>

      <button type="button" class="filters__reset-btn">Сбросить параметры</button>
    </aside>

  </section>
</template>

<script setup lang="ts">

interface Apartment {
  id: number
  plan: string
  type: number
  area: number
  floor: number
  totalFloors: number
  price: number
}

const apartments = ref<Apartment[]>([])

onMounted(async () => {
  const res = await fetch('/data/apartments.json')
  apartments.value = await res.json()
})
</script>

<style scoped></style>
