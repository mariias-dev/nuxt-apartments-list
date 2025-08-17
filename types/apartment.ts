export interface Apartment {
  id: number
  plan: string
  rooms: number
  area: number
  floor: number
  totalFloors: number
  price: number
}

export interface ApartmentFilters {
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  rooms: number[];
  sortBy?: 'area' | 'floor' | 'price';
  sortDir?: 'asc' | 'desc';
}

export interface ApartmentStats {
  minPrice: number;
  maxPrice: number;
  minArea: number;
  maxArea: number;
  availableRooms: number[];
}

export interface Pagination {
  page: number;
  perPage: number;
  total: number;
}