// src/services/tradeService.ts

import { TradePublic, TradeCreateSchema, TradeUpdateSchema, TradeList, Message } from '../types/trade';
import { camelToSnake, snakeToCamel } from '../utils/caseConverters';

const apiUrl = import.meta.env.VITE_API_URL;
const tradesUrl = `${apiUrl}/trades/`;

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
