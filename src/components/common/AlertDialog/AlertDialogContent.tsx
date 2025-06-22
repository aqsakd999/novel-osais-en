import { createContext, ReactNode } from 'react'

type AlertDialogOptions = {
  title?: ReactNode
  message: ReactNode
}

export type AlertContextType = (options?: AlertDialogOptions) => Promise<void>

// eslint-disable-next-line
// @ts-ignore
const AlertDialogContext = createContext<AlertContextType>()

export default AlertDialogContext
