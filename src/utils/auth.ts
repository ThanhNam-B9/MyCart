import { User } from 'src/types/user.type'

export const saveAccessTokenToLS = (access_token: string) => {
  localStorage.setItem('access_token', access_token)
}
export const getAccessTokenToLS = () => localStorage.getItem('access_token') || ''
export const removeAuthLS = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('profile')
}
//

export const getProfileFromLS = () => {
  const result = localStorage.getItem('profile')
  return result ? JSON.parse(result) : null
}
export const saveProfileToLS = (profile: User) => {
  localStorage.setItem('profile', JSON.stringify(profile))
}
