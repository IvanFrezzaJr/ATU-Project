import { describe, it, expect } from 'vitest'
import { getTradeTypeDisplay } from '../src/utils/tradeUtils'
import { TradeType } from '../src/types/item'

describe('getTradeTypeDisplay', () => {
  it('returns correct display for delivery', () => {
    const result = getTradeTypeDisplay(TradeType.delivery)
    expect(result).toEqual({
      label: 'Delivery',
      style: { color: 'teal', fontWeight: 'bold' },
    })
  })

  it('returns correct display for pickup', () => {
    const result = getTradeTypeDisplay(TradeType.pickup)
    expect(result).toEqual({
      label: 'Pickup',
      style: { color: 'purple', fontWeight: 'bold' },
    })
  })

  it('returns correct display for post', () => {
    const result = getTradeTypeDisplay(TradeType.post)
    expect(result).toEqual({
      label: 'Post',
      style: { color: 'blue', fontWeight: 'bold' },
    })
  })

  it('returns Unknown for unknown status', () => {
    // @ts-expect-error: testing unknown status
    const result = getTradeTypeDisplay('something-else')
    expect(result).toEqual({
      label: 'Unknown',
      style: { color: 'red', fontWeight: 'bold' },
    })
  })
})
