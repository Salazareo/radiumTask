import { StatusCodes } from 'http-status-codes'

export interface ErrorWithStatusCode extends Error {
  statusCode?: StatusCodes
}

interface HttpErrorMessage {
  err: string
}

export type HttpResBody<T extends object = Record<string, unknown>> = T | HttpErrorMessage

export interface UserToken {
  username: string
  email: string
  balance: number
  owed: number
  owing: number
}
