import { AppContext } from '@app/config/context'
import { useContext } from 'react'
import { Navigate } from 'react-router-dom'

/**
 * Check access based on user's role
 * @param props Properties
 * @returns
 */
const PermissionCheck = ({
  roles,
  elementPass,
  elementFail,
}: {
  roles: string[]
  elementPass: JSX.Element
  elementFail: JSX.Element
}) => {
  const { user } = useContext(AppContext)
  if (!user) {
    return <Navigate to='/login' replace />
  }
  if (roles.includes('any')) {
    return elementPass
  }
  return elementFail
}

export default PermissionCheck
