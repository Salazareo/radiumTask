import { Controller, Delete, Get, Post, Put } from '@overnightjs/core'
import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import getLogger from 'pino'
import { User } from '../DB/tableSchemas/Users'
import { UserServiceDynamo } from '../services/UserService.ts/UserServiceDynamo'
import { HttpResBody } from '../types'
import { handleThrownError } from './utils'

const logger = getLogger()
@Controller('users')
export class UserController {
  userService: UserServiceDynamo

  constructor(userService = new UserServiceDynamo()) {
    this.userService = userService
  }

  @Get('')
  public async listUsers(
    req: Request<never, never, never, { count?: string; lastPageToken?: string }>,
    res: Response<HttpResBody<{ users: User[]; nextPageToken?: string }>>
  ) {
    try {
      const { count, lastPageToken } = req.query
      const pageSize = parseInt(count || '10', 10)
      if (isNaN(pageSize)) {
        return res.status(StatusCodes.BAD_REQUEST).send({ err: 'Invalid count query' })
      }
      const { users, nextPageToken } = await this.userService.listUsers(pageSize, lastPageToken)
      return res.status(StatusCodes.OK).json({ users, nextPageToken })
    } catch (untypedErr) {
      const { status, ...err } = handleThrownError(untypedErr)
      return res.status(status).json(err)
    }
  }

  @Put(':email')
  public async updateUser(req: Request<never, never, User>, res: Response<HttpResBody<User>>) {
    try {
      const updatedUser = await this.userService.updateUser(req.body)
      return res.status(StatusCodes.OK).json(updatedUser)
    } catch (untypedErr) {
      const { status, ...err } = handleThrownError(untypedErr)
      return res.status(status).json(err)
    }
  }

  @Get(':email')
  public async getUser(req: Request<{ email: string }>, res: Response<HttpResBody<User>>) {
    try {
      const userInfo = await this.userService.getUser(req.params.email)
      return res.status(StatusCodes.OK).json(userInfo)
    } catch (untypedErr) {
      const { status, ...err } = handleThrownError(untypedErr)
      return res.status(status).json(err)
    }
  }

  @Delete(':email')
  public async deleteUser(req: Request<{ email: string }>, res: Response) {
    try {
      await this.userService.deleteUser(req.params.email)
      return res.status(StatusCodes.OK).send('User deleted successfully')
    } catch (untypedErr) {
      const { status, ...err } = handleThrownError(untypedErr)
      return res.status(status).json(err)
    }
  }

  @Post('')
  public async create(
    req: Request<never, never, { email: string }>,
    res: Response<HttpResBody<User>>
  ) {
    try {
      if (!req.body.email) {
        logger.error('Missing req body or email')
        return res.status(StatusCodes.BAD_REQUEST).send({ err: 'Missing req body or email' })
      }
      const emailRegex = new RegExp(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
      if (!emailRegex.test(req.body.email)) {
        return res.status(StatusCodes.BAD_REQUEST).send({ err: 'Bad Email' })
      }

      const { email } = req.body

      const userInfo = await this.userService.createUser(email)
      return res.status(StatusCodes.OK).json(userInfo)
    } catch (untypedErr) {
      const { status, ...err } = handleThrownError(untypedErr)
      return res.status(status).json(err)
    }
  }
}
