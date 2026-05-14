import '@testing-library/jest-dom'

// Mock scrollIntoView as it's not implemented in JSDOM
window.HTMLElement.prototype.scrollIntoView = jest.fn()

// Mock PointerEvent which is used by Radix UI but not in JSDOM
if (!window.PointerEvent) {
  class PointerEvent extends MouseEvent {
    constructor(type: string, params: PointerEventInit = {}) {
      super(type, params)
    }
  }
  // @ts-expect-error - Mocking PointerEvent
  window.PointerEvent = PointerEvent
}
