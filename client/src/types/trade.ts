import { ItemResponse } from "./item";

export interface TradePublic {
  id: number;
  userItemIdFrom: number;
  userItemIdTo: number;
  tradeDate: string;
  tradeStatus: 'pending' | 'accepted' | 'rejected';
  }
  
  export interface TradeCreateSchema {
  userItemIdFrom: number;
  userItemIdTo: number;
  tradeStatus: 'pending' | 'accepted' | 'rejected';
  }
  
  export interface TradeUpdateSchema {
  tradeStatus?: 'pending' | 'accepted' | 'rejected';
  }
  
  export interface TradeList {
  trades: TradePublic[];
  }
  
  export interface Message {
  message: string;
  }
  

  export interface TradeResponse {
  id: number;
  user_item_from: ItemResponse;
  user_item_to: ItemResponse;
  trade_date: string;
  trade_status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  updated_at: string;
  }
  

  export interface PaginationResult<T> {
  data: T[];
  totalPages: number;
  totalItems: number;
  currentPage: number;
  }