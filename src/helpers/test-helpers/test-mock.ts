import * as redux from 'react-redux'

/**
 * Handles redirect event. You should use expect(screen.getByText(`Redirected to ${to}`)).toBeInTheDocument() to check route redirection.
 *
 * Example: expect(screen.getByText(`Redirected to /home`)).toBeInTheDocument()
 */
export const mockRouter = (options?: any) => {
  const mockOutput = {
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn(),
    useLocation: () => ({
      pathname: 'http://localhost:3000/',
    }),
    Redirect: jest.fn(({ to }) => `Redirected to ${to}`),
    Navigate: jest.fn().mockImplementation(({ children }) => {
      return children
    }),
    Routes: jest.fn().mockImplementation(({ children }) => {
      return children
    }),
    Route: jest.fn().mockImplementation(({ children }) => {
      return children
    }),
    ...options,
  }
  jest.mock('react-router-dom', () => mockOutput)
}

export const mockI18n = () => {
  jest.mock('react-i18next', () => ({
    ...jest.requireActual('react-i18next'),
    useTranslation: () => ({
      t: (key: string) => key,
      i18n: {
        changeLanguage: () =>
          new Promise(() => {
            /** empty function */
          }),
      },
    }),
  }))
}

export const mockReduxDispatch = () => {
  const mockDispatchFn = jest.fn()
  jest.spyOn(redux, 'useDispatch').mockReturnValue(mockDispatchFn)
  return mockDispatchFn
}

/**
 * Implementation of localStorage object
 */
class LocalStorageMock implements Storage {
  private store = new Map<string, string>()

  clear(): void {
    this.store.clear()
  }

  getItem(key: string): string | null {
    return this.store.get(String(key)) ?? null
  }

  removeItem(key: string): void {
    this.store.delete(String(key))
  }

  key(index: number): string | null {
    return index < 0 || index >= this.length ? null : Object.keys(this.store)[index]
  }

  setItem(key: string, value: string): void {
    this.store.set(String(key), String(value))
  }

  get length(): number {
    return this.store.size
  }
}

/**
 * localStorage instance
 */
const localStorageMock = new LocalStorageMock()

/**
 * Simulates browser's localStorage
 */
export const mockLocalStorage = () => {
  global.localStorage = localStorageMock
}
