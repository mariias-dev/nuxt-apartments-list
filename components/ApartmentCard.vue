<template>
  <li class="apartment-card">
    <img
      :src="props.apartment.plan"
      :alt="`Планировка: ${props.apartment.type}-комнатная квартира`"
      class="apartment-card__plan"
      loading="lazy"
    />

    <span class="apartment-card__type">
      {{ props.apartment.type }}-комн.
    </span>

    <span class="apartment-card__area">
      {{ props.apartment.area }} м²
    </span>

    <span class="apartment-card__floor">
      {{ props.apartment.floor }} / {{ props.apartment.totalFloors }}
    </span>

    <span class="apartment-card__price">
      {{ apartment.price }}
    </span>
  </li>
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

const props = defineProps<{
  apartment: Apartment
}>()

</script>

<style scoped lang="scss">

</style>
