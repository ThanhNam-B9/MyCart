import { User } from 'src/types/user.type'
import { SuccessResponseApi } from 'src/types/utils.type'
import http from 'src/utils/http'
export interface BodyUpdateUser extends Omit<User, '_id' | 'email' | 'roles' | 'createdAt' | 'updatedAt'> {
  password?: string
  new_password?: string
}

const UserApi = {
  getProfile: () => {
    return http.get<SuccessResponseApi<User>>('/me')
  },
  updateProfile: (body: BodyUpdateUser) => {
    return http.put<SuccessResponseApi<User>>('/user', body)
  },
  updateUploadAvatar: (body: FormData) => {
    return http.post<SuccessResponseApi<string>>('/user/upload-avatar', body, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  }
}

export default UserApi
