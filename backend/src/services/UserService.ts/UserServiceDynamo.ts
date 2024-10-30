import {
  DeleteCommand,
  GetCommand,
  PutCommand,
  ScanCommand,
  UpdateCommand
} from '@aws-sdk/lib-dynamodb'
import { dynamo } from '../../DB/dynamo/DBClient'
import { User } from '../../DB/tableSchemas/Users'
import { IUserService } from './IUserService'

export class UserServiceDynamo implements IUserService {
  async listUsers(
    count: number,
    lastPageToken?: string
  ): Promise<{ users: User[]; nextPageToken?: string }> {
    const scanRequest = new ScanCommand({
      TableName: User.tableName,
      Limit: count,
      ExclusiveStartKey: lastPageToken ? JSON.parse(lastPageToken) : undefined,
      ProjectionExpression: 'email, #name, createdOn',
      ExpressionAttributeNames: {
        '#name': 'name'
      }
    })
    const response = await dynamo.send(scanRequest)
    return {
      users: response.Items as User[],
      nextPageToken: response.LastEvaluatedKey
        ? JSON.stringify(response.LastEvaluatedKey)
        : undefined
    }
  }
  async updateUser(user: User): Promise<User> {
    const dynamoUpdateParams = new UpdateCommand({
      TableName: User.tableName,
      Key: {
        email: user.email
      },
      UpdateExpression: `SET ${Object.entries(user)
        .filter(([key]) => key !== 'email')
        .map(([key]) => `#${key} = :${key}`)
        .join(', ')}`,
      ExpressionAttributeNames: Object.keys(user)
        .filter((key) => key !== 'email')
        .reduce(
          (acc, k) => {
            acc[`#${k}`] = k
            return acc
          },
          {} as Record<string, string>
        ),
      ExpressionAttributeValues: Object.entries(user)
        .filter(([key]) => key !== 'email')
        .reduce(
          (acc, [key, value]) => {
            acc[`:${key}`] = value
            return acc
          },
          {} as Record<string, string>
        )
    })
    await dynamo.send(dynamoUpdateParams)
    return user
  }
  async deleteUser(email: string): Promise<void> {
    const deleteParams = new DeleteCommand({
      TableName: User.tableName,
      Key: {
        email
      }
    })
    await dynamo.send(deleteParams)
  }
  async createUser(email: string): Promise<User> {
    const userInfo = {
      email,
      createdOn: Date.now(),
      name: email.split('@')[0]
    } as User
    const dynamoUpdateParams = new PutCommand({
      TableName: User.tableName,
      Item: userInfo
    })
    await dynamo.send(dynamoUpdateParams)
    return userInfo
  }
  async getUser(email: string): Promise<User> {
    const dynamoGetParams = new GetCommand({
      TableName: User.tableName,
      Key: {
        email
      },
      ProjectionExpression: 'email, #name, createdOn',
      ExpressionAttributeNames: {
        '#name': 'name'
      }
    })
    return (await dynamo.send(dynamoGetParams)).Item as User
  }
}
