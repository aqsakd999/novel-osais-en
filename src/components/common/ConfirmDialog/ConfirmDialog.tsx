import {
  ButtonBaseActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material'
import React from 'react'

export type ConfirmDialogProps = {
  open?: boolean
  title?: string
  message?: string
  onCancel?: () => void
  onOk?: () => void
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open = false,
  title,
  message,
  onOk,
  onCancel,
}: ConfirmDialogProps) => {
  const action = (instance: ButtonBaseActions | null) => {
    if (instance) {
      instance.focusVisible()
    }
  }

  const msg = React.useMemo(() => {
    if (!message) {
      return ''
    }
    const m: Array<React.ReactNode> = []
    message.split(/\r\n|\n/).forEach((str, index) => {
      m.push(str)
      // eslint-disable-next-line
      m.push(<br key={`br-${index}`} />)
    })
    return m
  }, [message])

  return (
    <Dialog
      id='confirm-dialog'
      data-testid='confirm-dialog'
      fullWidth
      open={open}
      onClose={onCancel}
      style={{ zIndex: 2000 }}
    >
      {title && <DialogTitle id='confirm-dialog-title'>{title}</DialogTitle>}
      <DialogContent>
        <DialogContentText id='confirm-dialog-message' data-testid='confirm-dialog-message'>
          {msg}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          id='confirm-dialog-ok-button'
          onClick={onOk}
          autoFocus
          focusRipple
          action={action}
          data-testid='confirm-dialog-ok-button'
        >
          OK
        </Button>
        <Button
          id='confirm-dialog-cancel-button'
          onClick={onCancel}
          data-testid='confirm-dialog-cancel-button'
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}
export default ConfirmDialog
