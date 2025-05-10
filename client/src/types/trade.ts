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
    userItemFrom: ItemResponse;
    userItemTo: ItemResponse;
    tradeDate: string;
    tradeStatus: 'pending' | 'accepted' | 'rejected';
    createdAt: string;
    updatedAt: string;
  }
  

  export interface PaginationResult<T> {
  data: T[];
  totalPages: number;
  totalItems: number;
  currentPage: number;
  }