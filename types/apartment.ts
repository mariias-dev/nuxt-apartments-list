export interface Apartment {
  id: number
  plan: string
  rooms: number
  area: number
  floor: number
  totalFloors: number
  price: number
}

export enum Columns {
  Area = 'area',
  Floor = 'floor',
  Price = 'price'
}

export enum SortDirection {
  Asc = 'asc',
  Desc = 'desc'
}

export interface ApartmentFilters {
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  rooms?: number[];
  sortBy?: Columns;
  sortDir?: SortDirection;
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