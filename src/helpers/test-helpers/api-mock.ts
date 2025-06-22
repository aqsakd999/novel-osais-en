/**
 * Incase old versions of axios that have no AxiosHeaders class, just remove all AxiosHeaders
 */
import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

/**
 * Produce HTTP status text based on status code
 * @param status
 * @returns
 */
export const getStatusText = (status: number) => {
  switch (status) {
    case 200:
    case 201:
      return 'OK'
    case 400:
      return 'Bad Request'
    case 401:
      return 'Unauthorized'
    case 403:
      return 'Forbidden'
    case 404:
      return 'Not Found'
    case 500:
      return 'Internal Server Error'
    case 501:
      return 'Not Implemented'
    default:
      return 'Unknown Error'
  }
}

/**
 * Create success response with data
 * @param status
 * @param data
 * @returns
 */
const makeResponse = <T>(status: number, data?: T): AxiosResponse<T | undefined> => ({
  data,
  status,
  statusText: getStatusText(status),
  config: {
    // @ts-ignore
    headers: {},
  },
  headers: {
    'Content-Type': 'application/json',
  },
})

type ApiMethod = 'get' | 'post' | 'put' | 'delete' | 'patch'

interface ApiInfo {
  url: string
  method: ApiMethod
  config?: {
    params?: any
    data?: any
  }
}

interface ApiItem extends ApiInfo {
  status: number
  dataOrCallback?: unknown | ((status: number) => unknown)
}

interface ApiList {
  find(
    url: string,
    method: string,
    config?: AxiosRequestConfig<unknown> | undefined,
  ): ApiItem | undefined
  add(api: ApiItem): ApiList
}

/**
 * Interface for API mock response
 */
interface ApiResponse {
  reply(statusOrData: number | any): ApiMock
  reply(status: number, callback: (status: number) => unknown): ApiMock
}

/**
 * Interface for API mock
 */
interface ApiMock {
  onGet(url: string, config?: { params: any }): ApiResponse
  onPost(url: string, config?: { data: any }): ApiResponse
  onPut(url: string, config?: { data: any }): ApiResponse
  onDelete(url: string, config?: { params: any }): ApiResponse
  onPatch(url: string, config?: { data: any }): ApiResponse
}

/**
 * Print API call on stdout
 * @param method
 * @param url
 * @param status
 */
const trackApi = (method: string, url: string, status: number) => {
  console.log(`>> ${method.toUpperCase()} (${status})`, url)
}

/**
 * Parse API request
 */
const parseRequest = (
  args:
    | [url: string, config?: AxiosRequestConfig<unknown> | undefined]
    | [url: string, data?: unknown, config?: AxiosRequestConfig<unknown> | undefined],
  method: string,
) => {
  let data: unknown | undefined
  let config: AxiosRequestConfig<unknown> | undefined
  const parts = args[0].split('?')
  const url = parts[0]

  // check request arguments
  if (args.length === 3) {
    data = args[1]
    config = args[2]
  } else if (args.length === 2) {
    if (method === 'get' || method === 'delete') {
      config = args[1] as AxiosRequestConfig<unknown>
    } else {
      data = args[1]
    }
  }
  //  read query parameters from URL
  if (parts.length == 2) {
    if (parts.length >= 2) {
      const params = JSON.parse(
        '{"' +
          decodeURI(parts[1]).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') +
          '"}',
      )
      if (config != null) {
        config = {
          ...config,
          params,
        }
      } else {
        config = { params }
      }
    }
  }
  return { url, data, config }
}

/**
 * Applies the axios instance's fulfilled interceptors to the response
 * @param axiosInstance
 * @param invoker
 * @returns
 */
const fulfillResponse = (
  axiosInstance: AxiosInstance,
  response: AxiosResponse<unknown, any>,
): AxiosResponse<unknown, any> => {
  const {
    interceptors: { response: responseInterceptor },
  } = axiosInstance
  const { handlers } = responseInterceptor as any
  if (Array.isArray(handlers)) {
    for (const { fulfilled } of handlers) {
      fulfilled && (response = fulfilled(response))
    }
  }
  return response
}

/**
 * Applies the axios instance's rejected interceptors to the response error
 * @param axiosInstance
 * @param invoker
 * @returns
 */
const rejectResponse = (axiosInstance: AxiosInstance, error: any): any => {
  const {
    interceptors: { response: responseInterceptor },
  } = axiosInstance
  const { handlers } = responseInterceptor as any
  if (Array.isArray(handlers)) {
    for (const { rejected } of handlers) {
      rejected && (error = rejected(error))
    }
  }
  return error
}

/**
 * Register API mock by method
 * @param axiosInstance
 * @param apiList
 * @param method
 * @param silent
 */
const spyOnMethod = (
  axiosInstance: AxiosInstance,
  apiList: ApiList,
  method: ApiMethod,
  silent?: boolean,
) => {
  jest.spyOn(axiosInstance, method).mockImplementation((...args) => {
    const { url, config } = parseRequest(args, method)
    const api = apiList.find(url, method, config)
    let invoker: Promise<AxiosResponse<unknown, any>>
    if (api == null) {
      !silent && trackApi(method, url, 404)
      invoker = Promise.resolve(makeResponse(404))
    } else {
      const { status, dataOrCallback } = api
      !silent && trackApi(method, url, status)
      if (typeof dataOrCallback === 'function') {
        const result = dataOrCallback(status)
        if (result instanceof Error) {
          invoker = Promise.reject(result)
        } else {
          invoker = Promise.resolve(makeResponse(status, result))
        }
      } else {
        invoker = Promise.resolve(makeResponse(status, dataOrCallback))
      }
    }
    return invoker
      .then((response) => fulfillResponse(axiosInstance, response))
      .catch((error) => rejectResponse(axiosInstance, error))
  })
}

/**
 * Register API mock by all methods
 * @param axiosInstance
 * @param apiList
 * @param silent
 */
const spyOnAllMethods = (axiosInstance: AxiosInstance, apiList: ApiList, silent?: boolean) => {
  spyOnMethod(axiosInstance, apiList, 'get', silent)
  spyOnMethod(axiosInstance, apiList, 'post', silent)
  spyOnMethod(axiosInstance, apiList, 'put', silent)
  spyOnMethod(axiosInstance, apiList, 'delete', silent)
  spyOnMethod(axiosInstance, apiList, 'patch', silent)
}

/**
 * Handler that takes care API list actions
 */
class ApiListHandler implements ApiList {
  private apiArray: ApiItem[] = []

  find(url: string, method: string, config?: AxiosRequestConfig<unknown> | undefined) {
    const index = this.indexOf(url, method, config)
    return index >= 0 ? this.apiArray[index] : undefined
  }

  add(api: ApiItem) {
    const { url, method } = api
    const index = this.indexOf(url, method)
    if (index >= 0) {
      this.apiArray[index] = api
    } else {
      this.apiArray.push(api)
    }
    return this
  }

  private indexOf(url: string, method: string, config?: AxiosRequestConfig<unknown> | undefined) {
    let pos = -1
    if (config) {
      const { params, data } = config
      const paramsStr = JSON.stringify(params)
      const dataStr = JSON.stringify(data)
      const index = this.apiArray.findIndex((api, index) => {
        if (url === api.url && method === api.method) {
          let apiParamsStr: string | undefined
          let apiDataStr: string | undefined
          const { config } = api
          if (config) {
            apiParamsStr = JSON.stringify(config.params)
            apiDataStr = JSON.stringify(config.data)
            return paramsStr === apiParamsStr && dataStr === apiDataStr
          } else {
            pos = index
          }
        }
      })
      if (index >= 0) {
        pos = index
      }
    } else {
      pos = this.apiArray.findIndex((api) => url === api.url && method === api.method)
    }
    return pos
  }
}

/**
 * handler that takes care API response
 */
class ApiResponseHandler implements ApiResponse {
  private mock: ApiMock
  private apiList: ApiListHandler
  private api: ApiInfo

  constructor(mock: ApiMock, apiList: ApiListHandler, api: ApiInfo) {
    this.mock = mock
    this.apiList = apiList
    this.api = api
  }

  reply(
    ...args:
      | [statusOrData: any]
      | [status: number, dataOrcallback: any | ((status: number) => unknown)]
  ): ApiMock {
    const { url, method, config } = this.api
    if (args.length === 2) {
      this.apiList.add({ url, method, status: args[0], dataOrCallback: args[1], config })
    } else {
      if (args[0] === parseInt(args[0])) {
        this.apiList.add({ url, method, status: args[0], config })
      } else {
        this.apiList.add({ url, method, status: 200, dataOrCallback: args[0], config })
      }
    }
    return this.mock
  }
}

/**
 * API mock handler
 */
class ApiMockHandler implements ApiMock {
  private apiList: ApiListHandler

  constructor(axiosInstance: AxiosInstance, silent?: boolean) {
    this.apiList = new ApiListHandler()
    spyOnAllMethods(axiosInstance, this.apiList, silent)
  }

  onGet(url: string, config?: { params: any }): ApiResponse {
    return new ApiResponseHandler(this, this.apiList, { url, method: 'get', config })
  }

  onPost(url: string, config?: { data?: any; params?: any }): ApiResponse {
    return new ApiResponseHandler(this, this.apiList, { url, method: 'post', config })
  }

  onPut(url: string, config?: { data: any }): ApiResponse {
    return new ApiResponseHandler(this, this.apiList, { url, method: 'put', config })
  }

  onDelete(url: string, config?: { params: any }): ApiResponse {
    return new ApiResponseHandler(this, this.apiList, { url, method: 'delete', config })
  }

  onPatch(url: string, config?: { data: any }): ApiResponse {
    return new ApiResponseHandler(this, this.apiList, { url, method: 'patch', config })
  }
}

/**
 * Setup API mock for Axios instance
 * @param axiosInstance
 * @param silent Decides to log API request on console or not
 * @returns
 */
export const mockApi = (axiosInstance: AxiosInstance, silent?: boolean) =>
  new ApiMockHandler(axiosInstance, silent)
