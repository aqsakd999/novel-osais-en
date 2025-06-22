import axiosInstance from './axios'
import { BASE_URL } from './constant'

export const fetchDataGetFromQuery = async (query: string) => {
  const response = await axiosInstance.post(BASE_URL, {
    query,
  })

  return response.data?.data
}
