import { Request, Response } from 'express'
import jsonwebtoken from 'jsonwebtoken'
import { UserToken } from '../types'
import { StatusCodes } from 'http-status-codes'
import { JWT_SECRET } from '../consts/secrets'

export const getUserFromRequest = (req: Request, res: Response) => {
  try {
    const decoded = jsonwebtoken.verify(req.signedCookies.token, JWT_SECRET)
    return decoded as UserToken
  } catch (err) {
    res
      .clearCookie('token')
      .status(StatusCodes.UNAUTHORIZED)
      .json({ err: (err as Error).message })
  }
}
