import {User} from './user';
import {PageType} from './page';



export interface ItemDetailFooterSetup{
    userInfo?: {
        show: boolean
    };
    actionMenu?: {
        show: boolean,
    }
    page: PageType,
    item?: UserItemResponse
}
  

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


export interface UserItemResponse extends ItemResponse {
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