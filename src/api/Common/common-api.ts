import axiosInstance from '../axios'
import { BASE_URL } from '../constant'

export const fetchMergedList = async (query: string) => {
  const response = await axiosInstance.post(BASE_URL, {
    query: query,
  })

  return response?.data?.data ?? {}
}
