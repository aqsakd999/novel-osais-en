import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { mockRouter, mockLocalStorage, mockI18n } from './helpers/test-helpers/test-mock'

/**
 * Match media definition to test like a browser
 * @param query
 * @returns
 */
window.matchMedia = (query) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: jest.fn(),
  removeListener: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
})

jest.setTimeout(30000)

beforeEach(() => {
  mockRouter()
  mockLocalStorage()
  mockI18n()
})

afterEach(() => {
  cleanup()
  jest.clearAllMocks()
  jest.restoreAllMocks()
})

afterAll(() => {
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  global.gc && global.gc()
})
