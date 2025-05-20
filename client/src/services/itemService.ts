import { UserItemResponse, PaginationResult, UserItemRequest } from '../types/item'
import { camelToSnake, snakeToCamel } from '../utils/caseConverters'
import { handleApiResponse } from './baseService'

const apiUrl = import.meta.env.VITE_API_URL
const itemsUrl = `${apiUrl}/items`

interface GetPaginatedItemsParams {
  page?: number
  itemsPerPage?: number
  inOffer?: boolean
  userId?: number | null
  token?: string | null
  search?: string | null
}

/**
 * Fetches all items.
 */
export const getAllItems = async (): Promise<UserItemResponse[]> => {
  const response = await fetch(itemsUrl)
  if (!response.ok) throw new Error('Error fetching all items')
  const data = await response.json()
  return snakeToCamel(data)
}

/**
 * Fetches an item by ID.
 * @param id - ID of the item to fetch.
 */
export const getItemById = async (id: number): Promise<UserItemResponse> => {
  const response = await fetch(`${itemsUrl}/${id}`)
  if (!response.ok) throw new Error('Error fetching item')
  const data = await response.json()
  return snakeToCamel(data)
}

/**
 * Creates a new item.
 * @param item - Data of the item to be created.
 */
export const createItem = async (
  item: Omit<UserItemRequest, 'id' | 'createdAt' | 'updatedAt'>,
  token: string
): Promise<UserItemResponse> => {
  const response = await fetch(itemsUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },

    body: JSON.stringify(camelToSnake(item)),
  })

  if (!response.ok) throw new Error('Error creating item')
  return await response.json()
}

/**
 * Updates an existing item.
 * @param id - ID of the item to update.
 * @param updatedItem - Updated item data.
 */
export const updateItem = async (
  id: number,
  updatedItem: Partial<Omit<UserItemRequest, 'id'>>,
  token: string
): Promise<UserItemResponse> => {
  const response = await fetch(`${itemsUrl}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },

    body: JSON.stringify(updatedItem),
  })

  if (!response.ok) throw new Error('Error updating item')
  return await response.json()
}

/**
 * Deletes an item by ID.
 * @param id - ID of the item to delete.
 */
export const deleteItem = async (id: number, token: string): Promise<void> => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${itemsUrl}/${id}`, {
    headers,
    method: 'DELETE',
  })

  await handleApiResponse<void>(response)
}

/**
 * Fetches paginated items.
 * @param page - Page number (starting from 1).
 * @param itemsPerPage - Number of items per page.
 */
export const getPaginatedItems = async ({
  page = 1,
  itemsPerPage = 2,
  userId,
  token,
  search,
}: GetPaginatedItemsParams): Promise<PaginationResult<UserItemResponse>> => {
  const offset = (page - 1) * itemsPerPage

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const query = new URLSearchParams({
    limit: itemsPerPage.toString(),
    offset: offset.toString(),
  })

  if (search) query.append('search', search)
  if (userId) query.append('user_id', userId.toString())

  console.log(`${itemsUrl}/?${query.toString()}`)

  const response = await fetch(`${itemsUrl}/?${query.toString()}`, {
    headers,
  })

  if (!response.ok) throw new Error('Error fetching paginated items')
  const data = await response.json()
  return snakeToCamel(data)
}

export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(`${itemsUrl}/upload-image`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) throw new Error('Error uploading image')

  const data = await response.json()
  return data.path // Ex: "/uploads/uuid123.png"
}
