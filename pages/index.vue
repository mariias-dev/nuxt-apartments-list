<template>
  <section class="apartments">
    <div class="apartments__list">
      <h1 class="apartments__title">Квартиры</h1>
      <header role="row" class="apartments__header">
        <span role="columnheader" class="apartments__col apartments__col--layout">Планировка</span>
        <span role="columnheader" class="apartments__col apartments__col--type">Квартира</span>

        <div role="columnheader" class="apartments__col apartments__col--area" :aria-sort="areaSortStatus"
          :class="areaColClasses">
          <button class="apartments__sort" type="button" title="Сортировать по площади" @click="toggleSort('area')">
            <span>S, м²</span>
            <div class="apartments__sort-arrows">
              <SvgoIcon class="apartments__sort-arrow apartments__sort-arrow--up" :class="{
                active:
                  store.filters.sortBy === 'area' &&
                  store.filters.sortDir === 'asc',
              }" name="caret-up" />
              <SvgoIcon class="apartments__sort-arrow apartments__sort-arrow--down" :class="{
                active:
                  store.filters.sortBy === 'area' &&
                  store.filters.sortDir === 'desc',
              }" name="caret-down" />
            </div>
          </button>
        </div>

        <div role="columnheader" class="apartments__col apartments__col--floor" :aria-sort="floorSortStatus"
          :class="floorColClasses">
          <button class="apartments__sort" type="button" title="Сортировать по этажу" @click="toggleSort('floor')">
            <span>Этаж</span>
            <div class="apartments__sort-arrows">
              <SvgoIcon class="apartments__sort-arrow apartments__sort-arrow--up" :class="{
                active:
                  store.filters.sortBy === 'floor' &&
                  store.filters.sortDir === 'asc',
              }" name="caret-up" />
              <SvgoIcon class="apartments__sort-arrow apartments__sort-arrow--down" :class="{
                active:
                  store.filters.sortBy === 'floor' &&
                  store.filters.sortDir === 'desc',
              }" name="caret-down" />
            </div>
          </button>
        </div>

        <div role="columnheader" class="apartments__col apartments__col--price" :aria-sort="priceSortStatus"
          :class="priceColClasses">
          <button class="apartments__sort" type="button" title="Сортировать по цене" @click="toggleSort('price')">
            <span>Цена, ₽</span>
            <div class="apartments__sort-arrows">
              <SvgoIcon class="apartments__sort-arrow apartments__sort-arrow--up" :class="{
                active:
                  store.filters.sortBy === 'price' &&
                  store.filters.sortDir === 'asc',
              }" name="caret-up" />
              <SvgoIcon class="apartments__sort-arrow apartments__sort-arrow--down" :class="{
                active:
                  store.filters.sortBy === 'price' &&
                  store.filters.sortDir === 'desc',
              }" name="caret-down" />
            </div>
          </button>
        </div>
      </header>
      <transition name="fade-list" mode="out-in">
        <div v-if="store.initialLoading" aria-live="polite" role="status" class="spinner" key="spinner">
          <div class="spinner__circle"></div>
        </div>

        <div v-else-if="store.apartments.length">
          <ul role="rowgroup" class="apartments__items" key="list">
            <ApartmentCard v-for="apartment in store.apartments" :key="apartment.id" :apartment="apartment" />
          </ul>

          <button v-if="
            !store.loading && store.apartments.length < store.pagination.total
          " :disabled="store.loading" class="apartments__more" type="button" @click="loadMore">
            <span>Загрузить еще</span>
          </button>
        </div>
        <div v-else-if="store.error" class="apartments__error" key="error">
          Произошла ошибка при загрузке данных
        </div>

        <div v-else class="apartments__empty" key="empty">
          По данным фильтрам ничего не найдено
        </div>
      </transition>
    </div>

    <ApartmentFilters />

    <button @click="scrollToTop" class="apartments__to-top" type="button" aria-label="Прокрутить вверх"
      :class="{ 'apartments__to-top--hidden': !showScrollButton }">
      <SvgoIcon aria-hidden="true" class="apartments__to-top-icon" name="arrow" />
    </button>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useApartmentsStore } from "@/stores/apartments";

const store = useApartmentsStore();
const { apartments, fetchApartments, loadMore, toggleSort } = store;

const showScrollButton = ref(false);

const getSortStatus = (column: 'area' | 'floor' | 'price') => computed(() => {
  if (store.filters.sortBy !== 'area') return 'none';
  return store.filters.sortDir === 'asc'
    ? 'ascending'
    : store.filters.sortDir === 'desc'
      ? 'descending'
      : 'none';
});
const areaSortStatus = getSortStatus('area');
const floorSortStatus = getSortStatus('floor');
const priceSortStatus = getSortStatus('price');

const getColumnClasses = (column: 'area' | 'floor' | 'price') => computed(() => ({
  'apartments__col--active': store.filters.sortBy === column,
  'apartments__col--desc': store.filters.sortBy === column && store.filters.sortDir === 'desc',
  'apartments__col--asc': store.filters.sortBy === column && store.filters.sortDir === 'asc'
}));

const areaColClasses = getColumnClasses('area');
const floorColClasses = getColumnClasses('floor');
const priceColClasses = getColumnClasses('price');

function handleScroll() {
  showScrollButton.value = window.scrollY > 200;
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
  handleScroll();

  if (apartments.length === 0) {
    fetchApartments();
  }
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<style scoped lang="sass">
.apartments
  display: flex
  gap: 80px

  &__empty, &__error
    text-align: center
    color: #7D7D7D
    margin-top: 50px

  @media (max-width: 960px)
    gap: 28px

  &__to-top
    position: fixed
    bottom: 32px
    right: 32px
    z-index: 1000
    cursor: pointer
    width: 40px
    height: 40px
    border-radius: 50%
    background-color: #95D0A1
    display: flex
    align-items: center
    justify-content: center
    border: none
    opacity: 1
    transform: translateY(0)
    transition: opacity 0.3s ease, transform 0.3s ease, background-color 0.2s ease, box-shadow 0.2s ease
    -webkit-tap-highlight-color: transparent

    @media (hover: hover) and (pointer: fine)
      &:hover
        background-color: #89BF94
        box-shadow: 0 4px 12px rgba(0,0,0,0.15)

    &:active
      background-color: #7DAE87

    &:focus-visible
      outline: 2px solid #2E7D32
      outline-offset: 3px

    &--hidden
      opacity: 0
      transform: translateY(100px)
      pointer-events: none

    @media (max-width: 960px)
      right: 16px
      bottom: 16px
      width: 35px
      height: 35px

  &__header
    display: flex
    span
      font-size: 14px
    @media (max-width: 768px)
      gap: 16px

    .apartments__col
      flex-shrink: 0
      padding: 0 10px
      height: 20px
      margin-bottom: 16px
      display: flex
      gap: 4px
      @media (max-width: 960px)
        margin: 8px 0

      .apartments__sort-arrow
        color: #7D7D7D
        transition: color 0.2s ease-in-out

      &--active
        .apartments__sort
          span
            color: #3EB57C
            font-weight: 500
        .apartments__sort-arrow
          color: #D0D0D0

      &--asc
        .apartments__sort-arrow--up
          color: #3EB57C

      &--desc
        .apartments__sort-arrow--down
          color: #3EB57C

      .apartments__sort
        display: flex
        cursor: pointer
        align-items: center
        background-color: transparent
        border: none
        justify-content: center
        gap: 2px
      .apartments__sort-arrows
        display: flex
        flex-direction: column
        align-items: center
        gap: 2px
        margin-left: 3px
        .apartments__sort-arrow
          &--up
            margin-left: 10%

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
      @media (max-width: 960px)
        width: fit-content

    .apartments__col--floor
      width: 17%
      @media (max-width: 960px)
        width: fit-content

    .apartments__col--price
      width: 17%
      @media (max-width: 960px)
        width: fit-content

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
    border: 1px solid rgba(11, 23, 57, 0.2)
    background: transparent
    margin-top: 48px
    transition: background-color 0.2s ease-in-out, border-color 0.2s ease-in-out
    -webkit-tap-highlight-color: transparent

    @media (max-width: 960px)
      margin-top: 24px

    &:disabled
      opacity: 0.6
      cursor: not-allowed
      background-color: transparent

    &:hover:active:not(:disabled)
      background-color: #7DAE87


    &:focus-visible
      outline: 2px solid #2E7D32
      outline-offset: 3px

    @media (hover: hover) and (pointer: fine)
      &:hover:not(:disabled)
        background-color: #89BF94

    @media (max-width: 768px)
      width: 100%
      text-align: center
      height: 30px

@media (max-width: 768px)
  .apartments
    flex-direction: column-reverse

.spinner
  display: flex
  flex-direction: column
  align-items: center
  justify-content: center
  min-height: 400px
  gap: 12px
  @media (max-width: 768px)
    min-height: fit-content
    margin-top: 50px
  &__circle
    width: 40px
    height: 40px
    border: 4px solid rgba(0, 0, 0, 0.1)
    border-top-color: #3EB57C
    border-radius: 50%
    animation: spin 1s linear infinite

@keyframes spin
  to
    transform: rotate(360deg)

.fade-list-enter-active
  transition: all 0.35s cubic-bezier(0.22, 1, 0.36, 1) // пружинящий эффект
.fade-list-leave-active
  transition: all 0.25s ease-in

.fade-list-enter-from
  opacity: 0
  transform: translateY(30px) scale(0.95) rotateX(10deg)

.fade-list-enter-to
  opacity: 1
  transform: translateY(0) scale(1) rotateX(0)

.fade-list-leave-from
  opacity: 1
  transform: translateY(0) scale(1) rotateX(0)

.fade-list-leave-to
  opacity: 0
  transform: translateY(-20px) scale(0.9) rotateX(-5deg)
</style>
