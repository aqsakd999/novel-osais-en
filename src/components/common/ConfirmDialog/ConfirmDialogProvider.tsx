import React, { useState, useCallback } from 'react'
import ConfirmDialog, { ConfirmDialogProps } from './ConfirmDialog'
import ConfirmDialogContext from './ConfirmDialogContext'

type Props = {
  children?: React.ReactNode
  defaultOptions?: ConfirmDialogProps
}

export const ConfirmDialogProvider: React.FC<Props> = ({
  children,
  defaultOptions = {},
}: Props) => {
  const [options, setOptions] = useState<ConfirmDialogProps>({ ...defaultOptions })
  const [resolveRejects, setResolveFunc] = useState<Array<React.Dispatch<boolean>>>([])
  const [resolve] = resolveRejects

  const confirm = useCallback(
    (confirmOptions: ConfirmDialogProps = {}) => {
      const newOptions = { ...defaultOptions, ...confirmOptions }
      setOptions(newOptions)
      return new Promise<boolean>(
        (resolveP: React.Dispatch<boolean>, rejectP: React.Dispatch<boolean>) => {
          setResolveFunc([resolveP, rejectP])
        },
      )
    },
    [setOptions, setResolveFunc, defaultOptions],
  )

  const handleClose = useCallback(() => {
    setResolveFunc([])
  }, [])

  const handleCancel = useCallback(() => {
    resolve(false)
    handleClose()
  }, [resolve, handleClose])

  const handleOk = useCallback(() => {
    resolve(true)
    handleClose()
  }, [resolve, handleClose])

  return (
    <>
      <ConfirmDialogContext.Provider value={confirm}>{children}</ConfirmDialogContext.Provider>
      <ConfirmDialog
        open={resolveRejects.length > 0}
        onCancel={handleCancel}
        onOk={handleOk}
        title={options.title}
        message={options.message}
      />
    </>
  )
}

export default ConfirmDialogProvider
