import { readFile } from 'fs/promises';
import { join } from 'path';
import type { Apartment, ApartmentFilters, ApartmentStats, Pagination } from '@/types/apartment';

interface ApiResponse {
  data: Apartment[];
  pagination: Pagination;
  stats: ApartmentStats;
}

export default defineEventHandler(async (event): Promise<ApiResponse> => {
  const query = getQuery(event);
  
  const filePath = join(process.cwd(), 'server/data/apartments.json');
  const apartments: Apartment[] = JSON.parse(await readFile(filePath, 'utf-8'));

  const roomFiltered = applyRoomFilter(apartments, parseNumberArray(query.rooms?.toString()));

  const fullyFiltered = applyOtherFilters(roomFiltered, {
    minPrice: query.minPrice ? Number(query.minPrice) : undefined,
    maxPrice: query.maxPrice ? Number(query.maxPrice) : undefined,
    minArea: query.minArea ? Number(query.minArea) : undefined,
    maxArea: query.maxArea ? Number(query.maxArea) : undefined,
    sortBy: query.sortBy as ApartmentFilters['sortBy'],
    sortDir: query.sortDir as ApartmentFilters['sortDir']
  });

  const pagination = getPagination(query, fullyFiltered.length);
  const paginated = fullyFiltered.slice(pagination.start, pagination.start + pagination.perPage);

  return {
    data: paginated,
    pagination,
    stats: getStats(roomFiltered, apartments),
  };
});

function getStats(filtered: Apartment[], allApartments: Apartment[]): ApartmentStats {
  return {
    minPrice: filtered.length ? Math.min(...filtered.map(a => a.price)) : 0,
    maxPrice: filtered.length ? Math.max(...filtered.map(a => a.price)) : 0,
    minArea: filtered.length ? Math.min(...filtered.map(a => a.area)) : 0,
    maxArea: filtered.length ? Math.max(...filtered.map(a => a.area)) : 0,
    availableRooms: [...new Set(allApartments.map(a => a.rooms))].sort((a, b) => a - b),
  };
}

function applyRoomFilter(apartments: Apartment[], rooms: number[]): Apartment[] {
  if (!rooms.length) return [...apartments];
  return apartments.filter(a => rooms.includes(a.rooms));
}

function applyOtherFilters(apartments: Apartment[], filters: Omit<ApartmentFilters, 'rooms'>): Apartment[] {
  let result = [...apartments];

  if (filters.minPrice) {
    result = result.filter(a => a.price >= filters.minPrice!);
  }
  if (filters.maxPrice) {
    result = result.filter(a => a.price <= filters.maxPrice!);
  }

  if (filters.minArea) {
    result = result.filter(a => a.area >= filters.minArea!);
  }
  if (filters.maxArea) {
    result = result.filter(a => a.area <= filters.maxArea!);
  }

  if (filters.sortBy && filters.sortDir) {
    const sortDir = filters.sortDir === 'desc' ? -1 : 1;
    result.sort((a, b) => (a[filters.sortBy!] - b[filters.sortBy!]) * sortDir);
  }

  return result;
}

function parseNumberArray(input?: string | string[]): number[] {
  if (!input) return [];
  const items = Array.isArray(input) ? input : String(input).split(',');
  return items.map(Number).filter(n => !isNaN(n));
}

function getPagination(query: any, total: number) {
  const page = Math.max(1, Number(query.page ?? 1));
  const perPage = Math.min(50, Math.max(1, Number(query.perPage ?? 20)));
  return {
    page,
    perPage,
    total,
    start: (page - 1) * perPage
  };
}