import { createContext } from 'react'

type ConfirmDialogOptions = {
  title?: string
  message: string
}

export type ConfirmContextType = (options?: ConfirmDialogOptions) => Promise<boolean>

// eslint-disable-next-line
// @ts-ignore
const ConfirmDialogContext = createContext<ConfirmContextType>()

export default ConfirmDialogContext
