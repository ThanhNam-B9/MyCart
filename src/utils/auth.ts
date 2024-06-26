import { User } from 'src/types/user.type'

export const saveAccessTokenToLS = (access_token: string) => {
  localStorage.setItem('access_token', access_token)
}
export const saveAccessRefreshTokenToLS = (refresh_token: string) => {
  localStorage.setItem('refresh_token', refresh_token)
}
export const getAccessTokenToLS = () => localStorage.getItem('access_token') || ''
export const getAccessRefreshTokenToLS = () => localStorage.getItem('refresh_token') || ''

export const LocalStorageEventTarget = new EventTarget()
export const removeAuthLS = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  localStorage.removeItem('profile')
  const ClearEvent = new Event('removeAuthLS')
  LocalStorageEventTarget.dispatchEvent(ClearEvent)
}
//

export const getProfileFromLS = () => {
  const result = localStorage.getItem('profile')
  return result ? JSON.parse(result) : null
}
export const saveProfileToLS = (profile: User) => {
  localStorage.setItem('profile', JSON.stringify(profile))
}
