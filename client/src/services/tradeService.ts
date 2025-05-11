// src/services/tradeService.ts

import { TradePublic, TradeCreateSchema, TradeUpdateSchema, TradeList, Message, TradeResponse, PaginationResult  } from '../types/trade';
import { camelToSnake, snakeToCamel } from '../utils/caseConverters';
import { handleApiResponse } from './baseService';

interface PaginatedParams {
page: number;
itemsPerPage: number;
token?: string | null;
onlyOffer?: boolean;
userId?: number | null;
}

const apiUrl = import.meta.env.VITE_API_URL;
const tradesUrl = `${apiUrl}/trades/`;
const tradesOfferFromUrl = `${apiUrl}/trades/offers/from`;
const tradesOfferToUrl = `${apiUrl}/trades/offers/to`;
const tradesHistoryUrl = `${apiUrl}/trades/history`;


/**
 * Cria uma nova troca.
 * @param trade - Dados da troca a ser criada.
 */
export const createTrade = async (
  trade: TradeCreateSchema
): Promise<TradePublic> => {
  const response = await fetch(tradesUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(camelToSnake(trade)),
  });

  if (!response.ok) throw new Error('Erro ao criar a troca');
  const data = await response.json();
  return snakeToCamel(data);
};

/**
 * Busca lista paginada de trocas.
 * @param limit - Quantidade de trocas por página.
 * @param offset - Offset da página.
 */
export const getTrades = async (
  limit = 10,
  offset = 0
): Promise<TradeList> => {
  const query = new URLSearchParams({
    limit: limit.toString(),
    offset: offset.toString(),
  });

  const response = await fetch(`${tradesUrl}/?${query.toString()}`);

  if (!response.ok) throw new Error('Erro ao buscar trocas');
  const data = await response.json();
  return snakeToCamel(data);
};

/**
 * Busca uma troca específica por ID.
 * @param id - ID da troca.
 */
export const getTradeById = async (
  id: number
): Promise<TradePublic> => {
  const response = await fetch(`${tradesUrl}/${id}`);

  if (!response.ok) throw new Error('Erro ao buscar troca');
  const data = await response.json();
  return snakeToCamel(data);
};

/**
 * Atualiza uma troca existente.
 * @param id - ID da troca a ser atualizada.
 * @param updateData - Dados para atualizar a troca.
 */
export const updateTrade = async (
  id: number,
  updateData: TradeUpdateSchema
): Promise<TradePublic> => {
  const response = await fetch(`${tradesUrl}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updateData),
  });

  if (!response.ok) throw new Error('Erro ao atualizar troca');
  const data = await response.json();
  return snakeToCamel(data);
};

/**
 * Deleta uma troca por ID.
 * @param id - ID da troca.
 */
export const deleteTrade = async (
  id: number
): Promise<Message> => {
  const response = await fetch(`${tradesUrl}/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) throw new Error('Erro ao deletar troca');
  const data = await response.json();
  return snakeToCamel(data);
};



export const getPaginatedTrades = async ({
  page = 1,
  itemsPerPage = 10,
  userId,
  onlyOffer,
  token,
}: PaginatedParams): Promise<PaginationResult<TradeResponse>> => {
  const offset = (page - 1) * itemsPerPage;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const query = new URLSearchParams({
    limit: itemsPerPage.toString(),
    offset: offset.toString(),
  });

  if (userId) query.append('user_id', userId.toString());
  if (onlyOffer) query.append('only_offer', 'true');

  const response = await fetch(`${tradesUrl}?${query.toString()}`, {
    headers,
  });

  if (!response.ok) {
    throw new Error('Erro ao buscar trocas paginadas');
  }

  const data = await response.json();
  return snakeToCamel(data);
};



export const getPaginatedTradesOfferFrom = async ({
  page = 1,
  itemsPerPage = 10,
  userId,
  token,
}: PaginatedParams): Promise<PaginationResult<TradeResponse>> => {
  const offset = (page - 1) * itemsPerPage;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const query = new URLSearchParams({
    limit: itemsPerPage.toString(),
    offset: offset.toString(),
    ongoing: true.toString(),
  });

  if (userId) query.append('user_id', userId.toString());

  const response = await fetch(`${tradesOfferFromUrl}?${query.toString()}`, {
    headers,
  });

  if (!response.ok) {
    throw new Error('Erro ao buscar trocas paginadas');
  }

  const data = await response.json();
  return snakeToCamel(data);
};


export const getPaginatedTradesOfferTo = async ({
  page = 1,
  itemsPerPage = 10,
  userId,
  token,
}: PaginatedParams): Promise<PaginationResult<TradeResponse>> => {
  const offset = (page - 1) * itemsPerPage;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const query = new URLSearchParams({
    limit: itemsPerPage.toString(),
    offset: offset.toString(),
    ongoing: true.toString(),
  });

  if (userId) query.append('user_id', userId.toString());


  const response = await fetch(`${tradesOfferToUrl}?${query.toString()}`, {
    headers,
  });

  if (!response.ok) {
    throw new Error('Erro ao buscar trocas paginadas');
  }

  const data = await response.json();
  return snakeToCamel(data);
};


export const getPaginatedHistory = async ({
  page = 1,
  itemsPerPage = 10,
  userId,
  token,
}: PaginatedParams): Promise<PaginationResult<TradeResponse>> => {
  const offset = (page - 1) * itemsPerPage;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const query = new URLSearchParams({
    limit: itemsPerPage.toString(),
    offset: offset.toString(),
    ongoing: false.toString(),
  });

  if (userId) query.append('user_id', userId.toString());


  const response = await fetch(`${tradesHistoryUrl}?${query.toString()}`, {
    headers,
  });

  if (!response.ok) {
    throw new Error('Erro ao buscar trocas paginadas');
  }

  const data = await response.json();
  return snakeToCamel(data);
};



export async function acceptTrade(id: number, token: string): Promise<void> {
  const response = await fetch(`${tradesUrl}${id}`, {
      method: "PUT",
      headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
      },
      body: JSON.stringify({"trade_status": "accepted"}),
  });

  await handleApiResponse<void>(response); 
}

export async function rejectTrade(id: number, token: string): Promise<void> {
  const response = await fetch(`${tradesUrl}${id}`, {
      method: "PUT",
      headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
      },
      body: JSON.stringify({"trade_status": "canceled"}),
  });

  await handleApiResponse<void>(response); 
}
