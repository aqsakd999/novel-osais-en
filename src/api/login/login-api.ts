import { getJwtToken } from '@app/helpers/TokenStoreUtils'
import axiosInstance from '../axios'

export async function loginByUsernameAndPassword(username: string, password: string): Promise<any> {
  return await axiosInstance.post('/auth/signIn', {
    username,
    password,
  })
}

export async function postLogout(): Promise<any> {
  const jwtToken = getJwtToken()
  return await axiosInstance.post('/refresh', {
    jwtToken,
  })
}

export const fetchUserProfile = async () => {
  const response = await axiosInstance.get(`/api/profile`)
  return response.data
}
