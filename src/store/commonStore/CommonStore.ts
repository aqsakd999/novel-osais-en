import { UserType } from '@app/config/context'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

export type Loading = 'NotLoad' | 'Loaded' | 'Loading' | 'Error'
export type DialogState = 'add' | 'edit' | 'view' | 'none'

interface ColorShades {
  100: string
  200: string
  300: string
  400: string
  500: string
  600: string
  700: string
  800: string
  900: string
}

export interface ColorTokens {
  grey: ColorShades
  primary: ColorShades
  greenAccent: ColorShades
  redAccent: ColorShades
  blueAccent: ColorShades
}

type ViewMoreSetting = {
  taskDisplayMultiple: boolean
  currentGroupBy: string
  displayMode: string
  showFinishedTasks: boolean
}

export type CommonState = {
  isLoading?: boolean
  isSidebar?: boolean
  title: string
  profile?: UserType
  extensionSidebar?: boolean
  messageAlert?: MessageAlertProp
  userInfo: any
  darkMode: boolean
  colorTokens: ColorTokens
  viewMoreSetting: ViewMoreSetting
  loadingStatusInit: Loading
}

export type MessageAlertProp = {
  info?: string
  isShowAlert?: boolean
  messageId?: string
  type?: string
}

const initialState = {
  isLoading: false,
  isSidebar: false,
  extensionSidebar: false,
  loadingStatusInit: 'NotLoad',
  title: '',
  darkMode: false,
  messageAlert: {
    info: '',
    isShowAlert: false,
    messageId: '',
    type: 'success',
  },
  userInfo: {},
  viewMoreSetting: {},
}

const commonStore = createSlice({
  name: 'common',
  initialState: initialState as CommonState,
  reducers: {
    setLoading: (state: CommonState, action) => {
      state.isLoading = action.payload
    },
    setSidebar: (state: CommonState, action) => {
      state.isSidebar = action.payload
    },
    setExtensionSidebar: (state: CommonState, action) => {
      state.extensionSidebar = action.payload
    },
    setMessageAlert: (state: CommonState, action: PayloadAction<MessageAlertProp>) => {
      state.messageAlert = {
        ...state.messageAlert,
        ...action.payload,
      }
    },
    setUserInfo: (state: CommonState, action) => {
      state.userInfo = action.payload
    },
    setColorTokens: (state: CommonState, action: PayloadAction<ColorTokens>) => {
      state.colorTokens = action.payload
    },
    setDarkmode: (state: CommonState, action: PayloadAction<boolean>) => {
      state.darkMode = action.payload
    },
    setTitle: (state: CommonState, action) => {
      state.title = action.payload
    },
    setViewMoreSetting: (state: CommonState, action: PayloadAction<ViewMoreSetting>) => {
      state.viewMoreSetting = action.payload
    },
    setLoadingStatusInit: (state: CommonState, action: PayloadAction<Loading>) => {
      state.loadingStatusInit = action.payload
    },
    setProfile: (state: CommonState, action: PayloadAction<UserType>) => {
      state.profile = action.payload
    },
  },
})

export default commonStore
