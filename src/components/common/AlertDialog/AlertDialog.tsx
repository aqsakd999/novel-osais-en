import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  ButtonBaseActions,
} from '@mui/material'
import React, { ReactNode } from 'react'

export type AlertDialogProps = {
  open?: boolean
  title?: ReactNode
  message?: ReactNode
  onClose?: () => void
}

const AlertDialog: React.FC<AlertDialogProps> = ({
  open = false,
  title,
  message,
  onClose,
}: AlertDialogProps) => {
  const action = (instance: ButtonBaseActions | null) => {
    if (instance) {
      instance.focusVisible()
    }
  }

  return (
    <Dialog
      id='alert-dialog'
      data-testid='alert-dialog'
      fullWidth
      open={open}
      onClose={onClose}
      style={{ zIndex: 2000 }}
    >
      {title && <DialogTitle id='alert-dialog-title'>{title}</DialogTitle>}
      <DialogContent>
        <DialogContentText id='alert-dialog-message' data-testid='alert-dialog-message'>
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          id='alert-dialog-ok-button'
          onClick={onClose}
          autoFocus
          focusRipple
          action={action}
          data-testid='alert-dialog-ok-button'
        >
          OK
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AlertDialog
