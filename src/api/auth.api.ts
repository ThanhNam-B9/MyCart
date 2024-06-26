import { AuthResponse } from 'src/types/auth.type'
import http from 'src/utils/http'
export const URL_REGISTER = 'register'
export const URL_LOGIN = 'login'
export const URL_REFRESH_TOKEN = 'refresh-access-token'
export const URL_LOGOUT = 'logout'

const authApi = {
  registerAccount: (body: { email: string; password: string }) => http.post<AuthResponse>(URL_REGISTER, body),
  loginAccount: (body: { email: string; password: string }) => http.post<AuthResponse>(URL_LOGIN, body),
  logoutAccount: () => http.post<AuthResponse>(URL_LOGOUT)
}
export default authApi
