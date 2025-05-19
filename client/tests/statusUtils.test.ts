import { describe, it, expect } from 'vitest'
import { getStatusDisplay } from '../src/utils/statusUtils'
import { ItemStatus } from '../src/types/item'

describe('getStatusDisplay', () => {
  it('returns correct display for OfferAgreed', () => {
    const result = getStatusDisplay(ItemStatus.OfferAgreed)
    expect(result).toEqual({
      label: 'Offer agreed',
      style: { color: 'green', fontWeight: 'bold' },
    })
  })

  it('returns correct display for InOffer', () => {
    const result = getStatusDisplay(ItemStatus.InOffer)
    expect(result).toEqual({
      label: 'In offer',
      style: { color: 'orange', fontWeight: 'bold' },
    })
  })

  it('returns correct display for NotListed', () => {
    const result = getStatusDisplay(ItemStatus.NotListed)
    expect(result).toEqual({
      label: 'Not listed',
      style: { color: 'gray', fontWeight: 'bold' },
    })
  })

  it('returns Unknown for unknown status', () => {
    // @ts-expect-error: testing unknown status
    const result = getStatusDisplay('something-else')
    expect(result).toEqual({
      label: 'Unknown',
      style: { color: 'red', fontWeight: 'bold' },
    })
  })
})
