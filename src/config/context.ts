import { createContext } from 'react'

export type UserType = {
  totalPoint?: number
  roles: { id: number; code: string; roleName: string }[]
  username: string
  id: number
}

export type AppContextType = {
  /**
   * Session user
   */
  user: UserType | null

  /**
   * Save session user
   * @param {UserType} user
   */
  saveUser: (user: UserType) => void

  /**
   * Delete session user
   */
  removeUser: () => void

  /**
   * Check role of session user
   * @param {array|string} role
   */
  isRole: (role: string | string[]) => boolean
}

export const AppContext = createContext<AppContextType>({
  user: null,
  saveUser: function (): void {
    throw new Error('Function not implemented.')
  },
  removeUser: function (): void {
    throw new Error('Function not implemented.')
  },
  isRole: function (): boolean {
    throw new Error('Function not implemented.')
  },
})
