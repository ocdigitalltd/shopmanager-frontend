export default {
  meEndpoint: '/auth/me',
  loginEndpoint: '/user/login',
  registerEndpoint: '/jwt/register',
  storageTokenKeyName: 'accessToken',
  onTokenExpiration: 'refreshToken' // logout | refreshToken
}
