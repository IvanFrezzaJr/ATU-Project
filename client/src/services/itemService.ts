import { UserItemResponse, PaginationResult } from '../types/item';
import { snakeToCamel } from '../utils/caseConverters';

const apiUrl = import.meta.env.VITE_API_URL;
const itemsUrl = `${apiUrl}/items`;



interface GetPaginatedItemsParams {
  page?: number;
  itemsPerPage?: number;
  onlyOfferItems?: boolean;
  onlyUserItems?: boolean;
  itemId?: number;
  token?: string | null;
}

/**
 * Fetches all items.
 */
export const getAllItems = async (): Promise<UserItemResponse[]> => {
  const response = await fetch(itemsUrl);
  if (!response.ok) throw new Error('Error fetching all items');
  const data = await response.json();
  return snakeToCamel(data);
};

/**
 * Fetches an item by ID.
 * @param id - ID of the item to fetch.
 */
export const getItemById = async (id: number): Promise<UserItemResponse> => {
  const response = await fetch(`${itemsUrl}/${id}`);
  if (!response.ok) throw new Error('Error fetching item');
  const data = await response.json();
  return snakeToCamel(data);
};

/**
 * Creates a new item.
 * @param item - Data of the item to be created.
 */
export const createItem = async (
  item: Omit<UserItemResponse, 'id' | 'createdAt' | 'updatedAt'>
): Promise<UserItemResponse> => {
  const response = await fetch(itemsUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item),
  });

  if (!response.ok) throw new Error('Error creating item');
  return await response.json();
};

/**
 * Updates an existing item.
 * @param id - ID of the item to update.
 * @param updatedItem - Updated item data.
 */
export const updateItem = async (
  id: number,
  updatedItem: Partial<Omit<UserItemResponse, 'id'>>
): Promise<UserItemResponse> => {
  const response = await fetch(`${itemsUrl}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedItem),
  });

  if (!response.ok) throw new Error('Error updating item');
  return await response.json();
};

/**
 * Deletes an item by ID.
 * @param id - ID of the item to delete.
 */
export const deleteItem = async (id: number): Promise<void> => {
  const response = await fetch(`${itemsUrl}/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) throw new Error('Error deleting item');
};

/**
 * Fetches paginated items.
 * @param page - Page number (starting from 1).
 * @param itemsPerPage - Number of items per page.
 */
export const getPaginatedItems = async ({
  page = 1,
  itemsPerPage = 10,
  onlyOfferItems = false,
  onlyUserItems = false,
  itemId,
  token,
}: GetPaginatedItemsParams): Promise<PaginationResult<UserItemResponse>> => {
  const offset = (page - 1) * itemsPerPage;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  console.log(token);
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const query = new URLSearchParams({
    limit: itemsPerPage.toString(),
    offset: offset.toString(),
  });

  if (onlyOfferItems) query.append('only_offer_items', 'true');
  if (onlyUserItems) query.append('only_user_items', 'true');
  if (itemId !== undefined) query.append('item_id', itemId.toString());

  const response = await fetch(`${itemsUrl}/?${query.toString()}`, {
    headers,
  });

  if (!response.ok) throw new Error('Error fetching paginated items');
  const data = await response.json();
  return snakeToCamel(data);
};
