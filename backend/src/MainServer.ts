import { Server } from '@overnightjs/core'
import bodyParser from 'body-parser'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { StatusCodes } from 'http-status-codes'
import getLogger from 'pino'
import { COOKIE_SECRET, IS_DEV } from './consts/secrets'
import { Controllers } from './controllers'
import { CreateDBTable } from './DB/dynamo/utils'
import { TableSchemas } from './DB/tableSchemas'

const logger = getLogger()

export class MainServer extends Server {
  private readonly SERVER_START_MSG = 'Main server started on port: '
  private readonly DEV_MSG =
    'Express Server is running in development mode. ' + 'No front-end content is being served.'

  constructor() {
    super(true)
    this.app.set('trust proxy', true)
    this.app.use(cookieParser(COOKIE_SECRET))
    this.app.use(compression())

    this.app.use(bodyParser.json())
    this.app.use(bodyParser.urlencoded({ extended: true }))
    this.app.use(
      cors({
        origin: ['http://localhost:5173', 'http://localhost:*'],
        credentials: true
      })
    )
    // this.app.use(
    //   jwt({
    //     credentialsRequired: true,
    //     secret: JWT_SECRET,
    //     algorithms: ['HS256'],
    //     getToken: (req) => {
    //       return req.signedCookies.token
    //     }
    //   }).unless(PUBLIC_PATHS)
    // )
    this.setupControllers()
    this.app.all(/.*/, (_req, res) => res.status(StatusCodes.NOT_ACCEPTABLE).end())
    this.createTablesIfNotExists()
    if (IS_DEV) {
      logger.info(this.DEV_MSG)
      this.app.get('*', (_req, res) => res.send(this.DEV_MSG))
    } else {
      //   this.serveFrontEndProd()
    }
  }

  public start(port: number): void {
    this.app.listen(port, '0.0.0.0', () => {
      logger.info(this.SERVER_START_MSG + port)
    })
  }

  private setupControllers(): void {
    const ctlrInstances = []
    for (const Controller of Controllers) {
      ctlrInstances.push(new Controller())
    }
    super.addControllers(ctlrInstances)
  }

  private createTablesIfNotExists(): void {
    for (const tableParam of TableSchemas) {
      CreateDBTable(tableParam)
    }
  }

  //   private serveFrontEndProd(): void {
  //     const dir = path.join('./build/public/react')
  //     this.app.use(express.static(dir))
  //     this.app.get('*', (_req, res) => {
  //       res.sendFile('index.html', { root: dir })
  //     })
  //   }
}
