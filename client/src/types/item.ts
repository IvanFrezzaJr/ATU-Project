import { User } from './user'
import { PageType } from './page'

export interface ItemDetailFooterSetup {
  userInfo?: {
    show: boolean
  }
  actionMenu?: {
    show: boolean
  }
  page: PageType
  item?: UserItemResponse
}

export interface ItemResponse {
  id: number
  name: string
  description: string
  quantity: number
  status: ItemStatus
  tradeType: TradeType
  imagesPath: string[]
  createdAt: Date
  updatedAt: Date
  user: User
}

export interface Item extends ItemResponse {
  userId: number
}

export interface UserItemResponse extends ItemResponse {
  user: User
}

export enum ItemStatus {
  OfferAgreed = 'offer_agreed',
  InOffer = 'in_offer',
  NotListed = 'not_listed',
}

export interface PaginationResult<ItemResponsePaginated> {
  data: ItemResponsePaginated[]
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
}

export enum TradeType {
  post = 'post',
  delivery = 'delivery',
  pickup = 'pickup',
}

export interface UserItemRequest {
  name: string
  description: string
  userId: number
  imagesPath: string[]
  quantity: number
  status: ItemStatus
  tradeType: TradeType
}

export interface AuthUser {
  id: string
  name: string
  email: string
  image?: string
}

export interface AuthContextType {
  user: AuthUser | null
  token: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}
