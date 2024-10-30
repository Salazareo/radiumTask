export const SALT_ROUNDS = 10
export const JWT_SECRET = 'someSecretForJWT'
export const COOKIE_SECRET = 'someSecretForCookies'
export const IS_DEV = process.env.NODE_ENV !== 'production'
export const PUBLIC_PATHS = { path: '/users/*' }
