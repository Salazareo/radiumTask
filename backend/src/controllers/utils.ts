import getLogger from 'pino'
const logger = getLogger()
import { ErrorWithStatusCode } from '../types'
import { StatusCodes } from 'http-status-codes'

export const handleThrownError = (untypedErr: unknown) => {
  const err = untypedErr as ErrorWithStatusCode
  logger.error(err)
  return {
    status: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    err: err.message || err.name
  }
}
