import { useEffect, useState } from 'react'
import { getAsJSON, removeAs, setAsJSON } from '../helpers/LocalStorageUtils'

import { APP_TITLE, USER_KEY } from './constants'
import { AppContext, UserType } from './context'
import ThemeProvider from './ThemeProvider'
import AlertDialogProvider from '@app/components/common/AlertDialog/AlertDialogProvider'
import ConfirmDialogProvider from '@app/components/common/ConfirmDialog/ConfirmDialogProvider'
import { useSelector } from 'react-redux'
import { RootState } from '@app/store/store'
import Loading from '@app/components/common/Loading/Loading'

const AppProvider = ({ children }: { children: JSX.Element }) => {
  const [user, setUser] = useState(getAsJSON(USER_KEY))
  const showLoading = useSelector((state: RootState) => state.commonStore.isLoading)

  useEffect(() => {
    document.title = APP_TITLE
  })

  /**
   * Save session user
   * @param {UserType} user
   */
  const saveUser = (user: UserType) => {
    setAsJSON(USER_KEY, user)
    setUser(user)
  }

  /**
   * Delete session user
   */
  const removeUser = () => {
    removeAs(USER_KEY)
    setUser(null)
  }

  /**
   * Check role of session user
   * @param {string|string[]} role
   * @returns
   */
  const isRole = (role: string | string[]) => {
    if (!user) {
      return false
    }
    if (Array.isArray(role)) {
      return role.includes(user.role)
    }
    return user.role === role
  }

  return (
    <ThemeProvider>
      <AlertDialogProvider>
        <ConfirmDialogProvider>
          <AppContext.Provider value={{ user, saveUser, removeUser, isRole }}>
            {children}
          </AppContext.Provider>
        </ConfirmDialogProvider>
      </AlertDialogProvider>
      {showLoading && <Loading />}
    </ThemeProvider>
  )
}

export default AppProvider
