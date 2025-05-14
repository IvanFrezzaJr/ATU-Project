import { TradeType } from '../types/item'

interface TradeTypeDisplay {
  label: string
  style: React.CSSProperties
}

export const getTradeTypeDisplay = (type: TradeType): TradeTypeDisplay => {
  switch (type) {
    case TradeType.post:
      return { label: 'Post', style: { color: 'blue', fontWeight: 'bold' } }
    case TradeType.delivery:
      return { label: 'Delivery', style: { color: 'teal', fontWeight: 'bold' } }
    case TradeType.pickup:
      return { label: 'Pickup', style: { color: 'purple', fontWeight: 'bold' } }
    default:
      return { label: 'Unknown', style: { color: 'red', fontWeight: 'bold' } }
  }
}
