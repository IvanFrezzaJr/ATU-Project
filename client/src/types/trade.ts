// src/types/trade.ts

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
  