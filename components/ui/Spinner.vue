<template>
  <div aria-live="polite" role="status" class="spinner" key="spinner">
    <div class="spinner__circle"></div>
  </div>
</template>

<script lang="ts" setup>

</script>

<style scoped lang="sass">
.spinner
  display: flex
  flex-direction: column
  align-items: center
  justify-content: center
  gap: 12px
  @media (max-width: 768px)
    min-height: fit-content
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
</style>