import { configureStore } from '@reduxjs/toolkit'
import { rootReducer } from '@app/store/store'

const mockStore = (hook?: (state: any) => void) => {
  const mockState = {
    commonReducer: {
      isLoading: false,
      messageAlert: {
        message: [],
        info: '',
        isShowAlert: false,
        messageId: '',
        type: 'success',
      },
      // userInfo,
      // PAGE_NUMBER,
      // PAGE_SIZE,
      // masterData: {},
    },
  }

  hook && hook(mockState)

  return configureStore({
    reducer: rootReducer,
    // preloadedState: mockState,
    middleware: (getDefaultMiddleware: any) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  })
}

export default mockStore
