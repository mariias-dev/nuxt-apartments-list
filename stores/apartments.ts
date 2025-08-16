import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Apartment } from '@/types/apartment'

export const useApartmentsStore = defineStore('apartments', () => {
  const apartments = ref<Apartment[]>([])
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)
  const loaded = ref<boolean>(false)

  const fetchApartments = async (forceRefresh = false) => {
    if ((loaded.value && !forceRefresh) || loading.value) return
    
    loading.value = true
    error.value = null
    
    try {
      const res = await fetch('/data/apartments.json')
      if (!res.ok) throw new Error(`Ошибка при загрузке данных: ${res.status} ${res.statusText}`)
      
      const data: Apartment[] = await res.json()
      await new Promise(resolve => setTimeout(resolve, 1000))

      apartments.value = data
      loaded.value = true
    } catch (err: unknown) {
      error.value = err instanceof Error 
        ? err.message 
        : 'Произошла ошибка при загрузке данных'
    } finally {
      loading.value = false
    }
  }

  return {
    apartments,
    loading,
    error,
    loaded,
    fetchApartments
  }
})