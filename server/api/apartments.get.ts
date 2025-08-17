import { readFile } from 'fs/promises'
import { join } from 'path'
import type { Apartment } from '@/types/apartment'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  const filePath = join(process.cwd(), 'server/data/apartments.json')
  const file = await readFile(filePath, 'utf-8')
  const apartments: Apartment[] = JSON.parse(file)

  let roomFiltered = [...apartments]
  if (query.rooms) {
    const rooms = (Array.isArray(query.rooms) ? query.rooms : String(query.rooms).split(','))
      .map(Number)
      .filter(n => !isNaN(n))

    if (rooms.length) {
      roomFiltered = roomFiltered.filter(a => rooms.includes(a.rooms))
    }
  }

  const minPrice = roomFiltered.length ? Math.min(...roomFiltered.map(a => a.price)) : 0
  const maxPrice = roomFiltered.length ? Math.max(...roomFiltered.map(a => a.price)) : 0
  const minArea  = roomFiltered.length ? Math.min(...roomFiltered.map(a => a.area)) : 0
  const maxArea  = roomFiltered.length ? Math.max(...roomFiltered.map(a => a.area)) : 0

  let filtered = [...roomFiltered]

  if (query.minPrice) {
    const minPrice = Math.max(0, Number(query.minPrice))
    filtered = filtered.filter(a => a.price >= minPrice)
  }
  if (query.maxPrice) {
    const maxPrice = Math.max(0, Number(query.maxPrice))
    filtered = filtered.filter(a => a.price <= maxPrice)
  }

  if (query.minArea) {
    const minArea = Math.max(0, Number(query.minArea))
    filtered = filtered.filter(a => a.area >= minArea)
  }
  if (query.maxArea) {
    const maxArea = Math.max(0, Number(query.maxArea))
    filtered = filtered.filter(a => a.area <= maxArea)
  }

  if (query.sortBy && query.sortDir) {
    const sortBy = String(query.sortBy)
    const sortDir = query.sortDir === 'desc' ? -1 : 1

    filtered.sort((a, b) => {
      let valA: number = 0
      let valB: number = 0

      if (sortBy === 'area') {
        valA = a.area
        valB = b.area
      } else if (sortBy === 'floor') {
        valA = a.floor
        valB = b.floor
      } else if (sortBy === 'price') {
        valA = a.price
        valB = b.price
      }

      return (valA - valB) * sortDir
    })
  }

  const page = Math.max(1, Number(query.page ?? 1))
  const perPage = Math.min(50, Math.max(1, Number(query.perPage ?? 20)))
  const start = (page - 1) * perPage
  const paginated = filtered.slice(start, start + perPage)

  return {
    total: filtered.length,
    page,
    perPage,
    data: paginated,
    stats: {
      minPrice: minPrice,
      maxPrice: maxPrice,
      minArea: minArea,
      maxArea: maxArea,
      availableRooms: [...new Set(apartments.map(a => a.rooms))].sort()
    }
  }
})
