import { defineStore } from 'pinia'
import type { Apartment } from '@/types/apartment'

interface ApartmentStats {
  minPrice: number
  maxPrice: number
  minArea: number
  maxArea: number
  availableRooms: number[]
}

export const useApartmentsStore = defineStore('apartments', () => {
  const apartments = ref<Apartment[]>([])
  const stats = ref<ApartmentStats | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const filters = ref({
    minPrice: undefined as number | undefined,
    maxPrice: undefined as number | undefined,
    minArea: undefined as number | undefined,
    maxArea: undefined as number | undefined,
    rooms: [] as number[],
    sortBy: undefined as 'area' | 'floor' | 'price' | undefined,
    sortDir: 'asc' as 'asc' | 'desc' | undefined
  })
  
  const pagination = ref({
    page: 1,
    perPage: 20,
    total: 0
  })

  const initialLoading = ref(true)

  const fetchApartments = async (append = false) => {
    if (!append) {
      initialLoading.value = true
    }
    loading.value = true
    error.value = null

    try {
      const params = new URLSearchParams()
      
      if (filters.value.minPrice) params.set('minPrice', filters.value.minPrice.toString())
      if (filters.value.maxPrice) params.set('maxPrice', filters.value.maxPrice.toString())
      if (filters.value.minArea) params.set('minArea', filters.value.minArea.toString())
      if (filters.value.maxArea) params.set('maxArea', filters.value.maxArea.toString())
      if (filters.value.rooms.length) params.set('rooms', filters.value.rooms.join(','))
      if (filters.value.sortBy) params.set('sortBy', filters.value.sortBy)
      if (filters.value.sortDir) params.set('sortDir', filters.value.sortDir)
        
      params.set('page', pagination.value.page.toString())
      params.set('perPage', pagination.value.perPage.toString())

      const res = await fetch(`/api/apartments?${params}`)
      if (!res.ok) throw new Error(res.statusText)

      const data = await res.json()

      if (append) {
        apartments.value = [...apartments.value, ...data.data]
      } else {
        apartments.value = data.data
      }
      pagination.value.total = data.total
      stats.value = data.stats
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error'
      if (!append) apartments.value = []
    } finally {
      loading.value = false
      if (!append) initialLoading.value = false
    }
  }

  const resetFilters = () => {
    filters.value = {
      minPrice: undefined,
      maxPrice: undefined,
      minArea: undefined,
      maxArea: undefined,
      rooms: [],
      sortBy: undefined,
      sortDir: 'asc'
    }
    pagination.value.page = 1
    fetchApartments()
  }

  const loadMore = () => {
    if (loading.value || apartments.value.length >= pagination.value.total) return
    pagination.value.page += 1
    fetchApartments(true) 
  }

  return { 
    apartments, 
    stats, 
    filters, 
    pagination,
    initialLoading,
    loading, 
    error,
    fetchApartments,
    resetFilters,
    loadMore
  }
})