import { describe, expect, it, vi } from 'vitest'
import { scrollToTop } from '../../src/utils/scroll'

describe('scrollToTop', () => {
  it('calls window.scrollTo if scrollY > 0', () => {
    vi.useFakeTimers()
    vi.stubGlobal('window', {
      scrollY: 100,
      scrollTo: vi.fn(),
    })

    scrollToTop()
    vi.runAllTimers()

    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })
    vi.useRealTimers()
  })

  it('does not call window.scrollTo if scrollY == 0', () => {
    vi.useFakeTimers()
    vi.stubGlobal('window', {
      scrollY: 0,
      scrollTo: vi.fn(),
    })

    scrollToTop()
    vi.runAllTimers()

    expect(window.scrollTo).not.toHaveBeenCalled()
    vi.useRealTimers()
  })

  it('respects the delay parameter', () => {
    vi.useFakeTimers()
    vi.stubGlobal('window', {
      scrollY: 100,
      scrollTo: vi.fn(),
    })

    scrollToTop(500)
    expect(window.scrollTo).not.toHaveBeenCalled()
    vi.advanceTimersByTime(500)
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })
    vi.useRealTimers()
  })
})
