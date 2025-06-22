import React, { useState, useCallback } from 'react'
import AlertDialog, { AlertDialogProps } from './AlertDialog'
import AlertDialogContext from './AlertDialogContent'

type Props = {
  children?: React.ReactNode
  defaultOptions?: AlertDialogProps
}

export const AlertDialogProvider: React.FC<Props> = ({ children, defaultOptions = {} }: Props) => {
  const [options, setOptions] = useState<AlertDialogProps>({ ...defaultOptions })
  const [resolveRejects, setResolveFunc] = useState<Array<React.Dispatch<void>>>([])
  const [resolve] = resolveRejects

  const alert = useCallback(
    (AlertOptions: AlertDialogProps = {}) => {
      setOptions({ ...defaultOptions, ...AlertOptions })
      return new Promise<void>((resolveP: React.Dispatch<void>, rejectP: React.Dispatch<void>) => {
        setResolveFunc([resolveP, rejectP])
      })
    },
    [setOptions, setResolveFunc, defaultOptions],
  )

  const handleClose = useCallback(() => {
    resolve()
    setResolveFunc([])
  }, [resolve])

  return (
    <>
      <AlertDialogContext.Provider value={alert}>{children}</AlertDialogContext.Provider>
      <AlertDialog
        open={resolveRejects.length > 0}
        onClose={handleClose}
        title={options.title}
        message={options.message}
      />
    </>
  )
}

export default AlertDialogProvider
