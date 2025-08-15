<template>
<li class="apartment-card">
  <img :src="props.apartment.plan" 
       :alt="`Планировка: ${props.apartment.type}-комнатная квартира`"
       class="apartment-card__plan" 
       loading="lazy" />

  <div class="apartment-card__info">
    <span class="apartment-card__type">
      {{ props.apartment.type }}-комнатная № {{ props.apartment.id }}
    </span>

    <div class="apartment-card__details">
      <span class="apartment-card__area">
        {{ props.apartment.area }} <span  class="apartment-card__unit-area">м²</span>
      </span>

      <span class="apartment-card__floor">
        {{ props.apartment.floor }} <span>из {{ props.apartment.totalFloors }} <span  class="apartment-card__unit-floor">этаж</span></span>
      </span>

      <span class="apartment-card__price">
        {{ formatPrice(props.apartment.price) }} <span  class="apartment-card__unit-price">₽</span>
      </span>
    </div>
  </div>
</li>

</template>

<script setup lang="ts">
import { formatPrice } from '@/utils/formatters'
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

<style scoped lang="sass">
.apartment-card
  display: flex
  padding: 16px 0 24px 0
  border-top: 1px solid #0000001A
  @media (max-width: 960px)
    padding: 16px 24px 20px 24px
    border: 1px solid #0000001A
    border-radius: 8px
    margin-bottom: 4px

  &:last-child
    border-bottom: 1px solid #0000001A

  &:hover

  &__plan
    aspect-ratio: 1 / 1
    width: 80px
    @media (max-width: 960px)
      order: 2

  &__floor
     span
      opacity: 0.5

  &__type,
  &__area,
  &__floor
    padding: 0 10px
    @media (max-width: 960px)
      padding: 0

  &__type
    @media (min-width: 960px)
      flex: 1
      font-weight: 500
    
    

  &__area,
  &__floor,
  &__price
    width: 33%
    @media (max-width: 960px)
      width: fit-content

  &__type
    padding-left: 25px
    @media (max-width: 960px)
      padding-left: 0

  /* новые блоки */
  &__info
    display: flex
    width: 100%
    @media (max-width: 960px)
      flex-direction: column
      gap: 16px

  &__details
    display: flex
    width: 56%
    @media (max-width: 1300px)
      width: 59%
      gap: 20px
    @media (max-width: 960px)
      width: 100%

.apartment-card__unit-area,
.apartment-card__unit-floor,
.apartment-card__unit-price
  @media (min-width: 960px)
    display: none

</style>
