import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

// dynamoDB client
const client = new DynamoDBClient({
  region: 'us-east-1',
  endpoint: 'http://dynamodb-local:8000',
  credentials: {
    accessKeyId: 'accessKeyId',
    secretAccessKey: 'secretAccess',
    sessionToken: 'sessionToken',
    accountId: 'accountId'
  },
  maxAttempts: 5,
  retryMode: 'adaptive'
})
export const dynamo = DynamoDBDocumentClient.from(client)
