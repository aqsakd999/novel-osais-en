import useSnackbar from '../useSnackbar'
import { useCallback } from 'react'

export const useHandleApiError = () => {
  const { snackbarError } = useSnackbar()

  return useCallback((error: any) => {
    const response = error?.response
    if (response?.status !== 200) {
      if (response?.data?.message) {
        snackbarError(response.data.message)
      } else if (response?.data?.errors) {
        snackbarError(response.data?.errors[0]?.message)
      } else {
        snackbarError('Error Occured')
      }
    }
  }, [])
}

export default useHandleApiError
