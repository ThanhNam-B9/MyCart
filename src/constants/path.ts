const path = {
  register: '/register',
  login: '/login',
  home: '/',
  profile: '/user/profile',
  logout: '/logout',
  productDetail: ':nameId',
  cart: '/cart',
  historyPurshases: '/user/purchase',
  changePassword: '/user/password',
  user: '/user'
} as const

export default path
