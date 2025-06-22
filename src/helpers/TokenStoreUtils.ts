import { REFRESH_TOKEN, TOKEN_KEY } from '../config/constants'
import { getAsString, removeAs, setAsString } from './LocalStorageUtils'

export const getJwtToken = () => {
  return getAsString(TOKEN_KEY)
}

export const getRefreshToken = () => {
  return getAsString(REFRESH_TOKEN)
}

export const setJwtToken = (jwtToken: string) => {
  setAsString(TOKEN_KEY, jwtToken)
}

export const setRefreshToken = (refreshToken: string) => {
  setAsString(REFRESH_TOKEN, refreshToken)
}

export const removeJwtToken = () => {
  removeAs(TOKEN_KEY)
}
