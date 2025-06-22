import { clearAll, getAsJSON } from '@app/helpers/LocalStorageUtils'
import { getJwtToken, setJwtToken } from '@app/helpers/TokenStoreUtils'
import axios from 'axios'

const baseUrl = process.env.REACT_APP_API_KEY

const options = {
  baseURL: baseUrl,
  headers: {
    Authorization: `Bearer `,
    'Content-type': 'application/json',
    Accept: 'application/json',
  },
}

if (getJwtToken() !== null) {
  options.headers = {
    Authorization: `Bearer ${getJwtToken()}`,
    'Content-type': 'application/json',
    Accept: 'application/json',
  }
}

export const loggingOut = () => {
  clearAll()
}

const axiosInstance = axios.create(options)

axiosInstance.interceptors.request.use(async (request: any) => {
  const isRefreshEndpoint = request.url.includes('/auth/refresh')
  if (!isRefreshEndpoint) {
    request.headers.Authorization = `Bearer ${getJwtToken()}`
  } else {
    request.headers.Authorization = null
  }
  return request
})

axiosInstance.interceptors.response.use(
  (response) => {
    // Handle success case
    if (response?.config?.url?.startsWith('/graphql') && response.data.errors) {
      // Handle GraphQL errors
      return Promise.reject({
        response: {
          status: 400,
          data: response.data,
        },
      })
    }
    return response
  },
  async (error) => {
    if (error.response?.status === 401 && error.response?.data?.message === 'JWT.EXPIRED') {
      // Token expired, attempt to refresh
      try {
        const refreshResponse = await axiosInstance.post('/auth/refresh', getAsJSON('USER'))
        const newToken = refreshResponse.data.token
        // Update the stored JWT token
        setJwtToken(newToken)

        // Retry the original request with the new token
        const retryRequest = { ...error.config, headers: { Authorization: `Bearer ${newToken}` } }
        console.log(retryRequest)
        if (retryRequest?.url === '/graphql' && typeof retryRequest.data === 'string') {
          retryRequest.data = JSON.parse(retryRequest.data)
        }
        return axios(retryRequest)
      } catch (refreshError) {
        // If refresh fails, log out
        console.log(refreshError)
      }
    } else if (error.response?.data?.message === 'JWT.WRONG') {
      loggingOut()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

export default axiosInstance
