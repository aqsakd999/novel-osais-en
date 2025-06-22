import { RootState } from '@app/store/store'
import { CloseOutlined } from '@mui/icons-material'
import IconButton from '@mui/material/IconButton'
import { useSnackbar as useNotistackSnackbar } from 'notistack'
import { useSelector } from 'react-redux'

export const useSnackbar = () => {
  const snackbar = useNotistackSnackbar()
  const { darkMode } = useSelector((state: RootState) => state.commonStore)

  const snackbarSuccess = (message: string) => {
    snackbar.enqueueSnackbar(message, {
      variant: 'success',
      autoHideDuration: 3000,
      anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'left',
      },
      style: {
        color: darkMode ? 'white' : 'black',
        backgroundColor: darkMode ? '#a2d5f5' : 'rgba(1, 87, 155, 1)',
      },
      action: (key) => (
        <IconButton
          size='small'
          aria-label='close'
          color='inherit'
          onClick={() => snackbar.closeSnackbar(key)}
        >
          <CloseOutlined fontSize='small' />
        </IconButton>
      ),
    })
  }

  const snackbarError = (message: string) => {
    snackbar.enqueueSnackbar(message, {
      variant: 'error',
      autoHideDuration: 3000,
      anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'left',
      },
      style: {
        backgroundColor: darkMode ? '#f05959' : 'rgba(255, 255, 255, 1)',
        color: darkMode ? 'white' : 'red',
      },
      action: (key) => (
        <IconButton
          size='small'
          aria-label='close'
          color='inherit'
          onClick={() => snackbar.closeSnackbar(key)}
        >
          <CloseOutlined fontSize='small' />
        </IconButton>
      ),
    })
  }

  // const { snackbarSuccess, snackbarError } = useSnackbar()
  // snackbarSuccess('Succes')
  // snackbarError('Error')
  return {
    snackbarSuccess,
    snackbarError,
  }
}

export default useSnackbar
