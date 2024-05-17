import axios, { AxiosError, AxiosInstance } from 'axios'
import { toast } from 'react-toastify'
import HttpStatusCode from 'src/constants/httpStatusCode.enum'
import { AuthResponse, RefreshTokenRespon } from 'src/types/auth.type'
import {
  getAccessRefreshTokenToLS,
  getAccessTokenToLS,
  removeAuthLS,
  saveAccessRefreshTokenToLS,
  saveAccessTokenToLS,
  saveProfileToLS
} from './auth'

import { config } from 'src/constants/config'
import { URL_LOGIN, URL_LOGOUT, URL_REFRESH_TOKEN, URL_REGISTER } from 'src/api/auth.api'
import { isAxiosExpiredError, isAxiosUnauthorizedError } from './utils'
import { ErrorResponseApi } from 'src/types/utils.type'

class Http {
  instance: AxiosInstance
  private accessToken: string
  private refreshToken: string
  private refreshTokenRequest: Promise<string> | null
  constructor() {
    this.accessToken = getAccessTokenToLS()
    this.refreshToken = getAccessRefreshTokenToLS()
    this.refreshTokenRequest = null
    this.instance = axios.create({
      baseURL: config.baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'expire-access-token': 10,
        'expire-refresh-token': 60 * 60
      }
    })
    this.instance.interceptors.request.use(
      (config) => {
        if (this.accessToken && config.headers) {
          config.headers.authorization = this.accessToken

          return config
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )
    this.instance.interceptors.response.use(
      (response) => {
        const { url } = response.config
        if (url === URL_LOGIN || url === URL_REGISTER) {
          const data = response.data as AuthResponse
          this.accessToken = data.data.access_token
          this.refreshToken = data.data.refresh_token
          saveAccessTokenToLS(this.accessToken)
          saveAccessRefreshTokenToLS(this.refreshToken)
          saveProfileToLS(data.data.user)
        } else if (url == URL_LOGOUT) {
          this.accessToken = ''
          this.refreshToken = ''
          removeAuthLS()
        }
        return response
      },
      (error: AxiosError) => {
        if (
          ![HttpStatusCode.Unauthorized, HttpStatusCode.UnprocessableEntity].includes(error.response?.status as number)
        ) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const data: any | undefined = error.response?.data
          const message = data?.message || error.message
          toast.error(message)
        }
        // Nếu là lỗi 401
        if (isAxiosUnauthorizedError<ErrorResponseApi<{ name: string; message: string }>>(error)) {
          const config = error.response?.config
          const url = config?.url
          //Trường hợpToken hết hạn và request không phải của request refresh token
          // Thì chúng ta tiến hành gọi refresh token
          if (isAxiosExpiredError(error) && url !== URL_REFRESH_TOKEN) {
            this.refreshTokenRequest = this.refreshTokenRequest
              ? this.refreshTokenRequest
              : this.handleRefreshToken().finally(() => {
                  // hạn chế gọi 2 lần handleRefreshToken()
                  // setTimOut để giữ request token không bị null sớm trước khi mấy api bị gọi trễ
                  setTimeout(() => {
                    this.refreshTokenRequest = null
                  }, 10000)
                })
            return this.refreshTokenRequest.then((access_token) => {
              return this.instance({ ...config, headers: { ...config?.headers, authorization: access_token } })
            })
          }
          // còn nhưng trương hợp còn lại như token không đúng
          // không truyền token
          //token heét hạn nhưng gọi refresh token bị fail
          // thì triển khai xóa localstogae và logout và thông báo
          removeAuthLS()
          this.accessToken = ''
          this.refreshToken = ''
          toast.error(error.response?.data.data?.message || error.response?.data.message)
        }

        return Promise.reject(error)
      }
    )
  }
  private handleRefreshToken() {
    return this.instance
      .post<RefreshTokenRespon>(URL_REFRESH_TOKEN, {
        refresh_token: this.refreshToken
      })
      .then((res) => {
        const { access_token } = res.data.data
        console.log('acc', access_token)
        this.accessToken = access_token
        saveAccessTokenToLS(access_token)
        return access_token
      })
      .catch((error) => {
        removeAuthLS()
        this.accessToken = ''
        this.refreshToken = ''
        throw error
      })
  }
}
const http = new Http().instance

export default http
