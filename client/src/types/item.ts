import {User} from './user';


export interface ItemResponse {
    id: number;
    name: string;
    description: string;
    quantity: number;
    status: ItemStatus;
    imagesPath: string[];
    createdAt: Date;
    updatedAt: Date;
}


export interface Item extends ItemResponse {
    userId: number;
}


export interface ItemResponsePaginated extends ItemResponse {
    user: User;
}

export enum ItemStatus {
    OfferAgreed = "offerAgreed",
    InOffer = "inOffer",
    NotListed = "notListed",
  }
  

  
export interface PaginationResult<ItemResponsePaginated> {
    data: ItemResponsePaginated[];
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  }