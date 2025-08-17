import { defineStore } from 'pinia';
import type { Apartment, ApartmentFilters, ApartmentStats, Pagination } from '@/types/apartment';

const FILTERS_KEY = 'apartments_filters'

interface ApartmentsState {
  apartments: Apartment[];
  stats: ApartmentStats | null;
  filters: ApartmentFilters;
  pagination: Pagination;
  loading: boolean;
  initialLoading: boolean;
  error: string | null;
}

export const useApartmentsStore = defineStore('apartments', () => {
  onMounted(() => {
    const saved = localStorage.getItem(FILTERS_KEY)
    if (saved) {
      Object.assign(state.filters, JSON.parse(saved))
    }

    watch(() => state.filters, (val) => {
      localStorage.setItem(FILTERS_KEY, JSON.stringify(val))
    }, { deep: true })
  })

  const state = reactive<ApartmentsState>({
    apartments: [],
    stats: null,
    filters: {
      rooms: [],
      sortDir: 'asc'
    },
    pagination: {
      page: 1,
      perPage: 20,
      total: 0
    },
    loading: false,
    initialLoading: true,
    error: null
  });

  const fetchApartments = async (options: { append?: boolean; filters?: Partial<ApartmentFilters> } = {}) => {
    const { append = false, filters } = options;
    
    if (!append) {
      state.initialLoading = true;
      state.pagination.page = 1;
    }
    
    state.loading = true;
    state.error = null;

    try {
      const effectiveFilters = filters ? { ...state.filters, ...filters } : state.filters;
      
      const params = new URLSearchParams();
      Object.entries(effectiveFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.set(key, Array.isArray(value) ? value.join(',') : String(value));
        }
      });
      
      params.set('page', state.pagination.page.toString());
      params.set('perPage', state.pagination.perPage.toString());

      const res = await $fetch(`/api/apartments?${params}`);
      
      if (append) {
        state.apartments = [...state.apartments, ...res.data];
      } else {
        state.apartments = res.data;
        state.stats = res.stats;
      }
      
      state.pagination.total = res.pagination.total;
    } catch (err) {
      state.error = err instanceof Error ? err.message : 'Unknown error';
      if (!append) {
        state.apartments = [];
        state.stats = null;
      }
    } finally {
      state.loading = false;
      if (!append) state.initialLoading = false;
    }
  };

  const updateFilter = async <K extends keyof ApartmentFilters>(key: K, value: ApartmentFilters[K]) => {
    state.filters[key] = value;
    state.pagination.page = 1;
    await fetchApartments();
  };

  const toggleSort = async (column: ApartmentFilters['sortBy']) => {
    if (state.filters.sortBy !== column) {
      await updateFilter('sortBy', column);
      await updateFilter('sortDir', 'asc');
    } else {
      const nextDir = 
        state.filters.sortDir === 'asc' ? 'desc' :
        state.filters.sortDir === 'desc' ? undefined : 'asc';
      
      if (nextDir) {
        await updateFilter('sortDir', nextDir);
      } else {
        await updateFilter('sortBy', undefined);
        await updateFilter('sortDir', undefined);
      }
    }
  };

  const resetFilters = async () => {
    state.filters = {
      rooms: [],
      sortDir: 'asc'
    };
    await fetchApartments();
  };

  const loadMore = async () => {
    if (state.loading || state.apartments.length >= state.pagination.total) return;
    state.pagination.page += 1;
    await fetchApartments({ append: true });
  };

  return { 
    ...toRefs(state),
    fetchApartments,
    updateFilter,
    toggleSort,
    resetFilters,
    loadMore
  };
});