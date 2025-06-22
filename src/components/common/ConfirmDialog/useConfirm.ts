import { useContext } from 'react'
import ConfirmDialogContext, { ConfirmContextType } from './ConfirmDialogContext'

export const useConfirm = (): ConfirmContextType => {
  const confirm = useContext<ConfirmContextType>(ConfirmDialogContext)
  return confirm
}

export default useConfirm
