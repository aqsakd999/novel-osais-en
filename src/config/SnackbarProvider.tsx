import React from 'react'
import styled from 'styled-components'
import { SnackbarProvider as NotistackSnackbarProvider } from 'notistack'
import { ErrorOutline, InfoOutlined, ReportOutlined } from '@mui/icons-material'
import { CheckCircle } from '@mui/icons-material'

type Props = {
  children?: React.ReactNode
}

const SnackbarIcon = styled.div`
  padding-top: 3px;
  margin-right: 12px;
  font-size: 1.25rem;
`

const ErrorIcon: React.FC = () => {
  return (
    <SnackbarIcon className='SnackbarIcon' data-testid='error-icon'>
      <ErrorOutline fontSize='inherit' />
    </SnackbarIcon>
  )
}

const InfoIcon: React.FC = () => {
  return (
    <SnackbarIcon className='SnackbarIcon' data-testid='info-icon'>
      <InfoOutlined fontSize='inherit' />
    </SnackbarIcon>
  )
}

const SuccessIcon: React.FC = () => {
  return (
    <SnackbarIcon className='SnackbarIcon' data-testid='success-icon'>
      <CheckCircle fontSize='inherit' />
    </SnackbarIcon>
  )
}

const WarningIcon: React.FC = () => {
  return (
    <SnackbarIcon className='SnackbarIcon' data-testid='warning-icon'>
      <ReportOutlined fontSize='inherit' />
    </SnackbarIcon>
  )
}

const SnackbarProvider: React.FC<Props> = ({ children }: Props) => {
  return (
    <NotistackSnackbarProvider
      data-testid='snackbar'
      maxSnack={5}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      iconVariant={{
        success: <SuccessIcon />,
        info: <InfoIcon />,
        warning: <WarningIcon />,
        error: <ErrorIcon />,
      }}
      hideIconVariant={true}
    >
      {children}
    </NotistackSnackbarProvider>
  )
}

export default SnackbarProvider
