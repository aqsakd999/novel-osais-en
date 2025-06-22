import { useContext } from 'react'
import AlertDialogContext, { AlertContextType } from './AlertDialogContent'

export const useAlert = (): AlertContextType => {
  const alert = useContext<AlertContextType>(AlertDialogContext)
  return alert
}

export default useAlert
