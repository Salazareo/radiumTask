import {
  CreateTableCommand,
  CreateTableCommandInput,
  CreateTableOutput,
  GlobalSecondaryIndex,
  ScalarAttributeType
} from '@aws-sdk/client-dynamodb'
import getLogger from 'pino'
import { DBTable } from '../DBTable'
import { GIndex, LIndex, TagMap } from '../annotations'
import { dynamo } from './DBClient'
const logger = getLogger()
export const AttributeMap: Record<string, ScalarAttributeType> = {
  string: 'S',
  number: 'N',
  boolean: 'B'
}

const tableToDefinition = (table: DBTable): CreateTableCommand => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const schema = {} as CreateTableCommandInput
  schema.TableName = table.tableName
  const tableDefault = table.getDefault()

  const pKey = TagMap[`${table.tableName}PKey`] as string
  const sKey = TagMap[`${table.tableName}SKey`] as string
  const localIndexes = TagMap[`${table.tableName}LocalIndex`] as LIndex[]
  const globalIndexes = TagMap[`${table.tableName}GlobalIndex`] as GIndex[]
  schema.KeySchema = [{ AttributeName: pKey, KeyType: 'HASH' }]
  schema.AttributeDefinitions = [
    {
      AttributeName: pKey,
      AttributeType:
        AttributeMap[
          typeof (tableDefault as unknown as Record<string, unknown>)[
            pKey
          ] as keyof typeof AttributeMap
        ]
    },
    ...(localIndexes || []).map((index: LIndex) => ({
      AttributeName: index.sKey,
      AttributeType:
        AttributeMap[
          typeof (tableDefault as unknown as Record<string, unknown>)[
            index.sKey!
          ] as keyof typeof AttributeMap
        ]
    })),
    ...(globalIndexes || []).map((index: GIndex) => ({
      AttributeName: index.pKey || index.sKey!,
      AttributeType:
        AttributeMap[
          typeof (tableDefault as unknown as Record<string, unknown>)[
            index.pKey || index.sKey!
          ] as keyof typeof AttributeMap
        ]
    }))
  ]
  if (sKey) {
    schema.KeySchema.push({ AttributeName: sKey, KeyType: 'RANGE' })
    schema.AttributeDefinitions.push({
      AttributeName: sKey,
      AttributeType:
        AttributeMap[
          typeof (tableDefault as unknown as Record<string, unknown>)[
            sKey
          ] as keyof typeof AttributeMap
        ]
    })
  }
  const seen = new Set<string>()
  schema.AttributeDefinitions = schema.AttributeDefinitions.filter((attr) => {
    if (seen.has(attr.AttributeName!)) {
      return false
    }
    seen.add(attr.AttributeName!)
    return true
  })
  if (localIndexes) {
    schema.LocalSecondaryIndexes = (localIndexes || []).map((index: LIndex) => ({
      IndexName: index.name,
      KeySchema: [
        { AttributeName: pKey, KeyType: 'HASH' },
        { AttributeName: index.sKey!, KeyType: 'RANGE' }
      ],
      Projection: {
        ProjectionType: 'ALL'
      },
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1
      }
    }))
  }

  if (globalIndexes) {
    const globalIndexPairs = ((globalIndexes || []) as GIndex[]).reduce(
      (acc: { [key: string]: { pKey?: string; sKey?: string } }, curr: GIndex) => {
        if (!acc[curr.name]) {
          acc[curr.name] = {}
        }

        if (curr.pKey) {
          acc[curr.name].pKey = curr.pKey
        } else {
          acc[curr.name].sKey = curr.sKey
        }
        return acc
      },
      {} as { [key: string]: { pKey?: string; sKey?: string } }
    )
    schema.GlobalSecondaryIndexes = Object.entries(globalIndexPairs).map(([name, index]) => {
      return {
        IndexName: name,
        KeySchema: [
          { AttributeName: index.pKey!, KeyType: 'HASH' },
          { AttributeName: index.sKey!, KeyType: 'RANGE' }
        ],
        Projection: {
          ProjectionType: 'ALL'
        },
        ProvisionedThroughput: {
          ReadCapacityUnits: 1,
          WriteCapacityUnits: 1
        }
      } as GlobalSecondaryIndex
    })
  }

  schema.ProvisionedThroughput = {
    ReadCapacityUnits: 1,
    WriteCapacityUnits: 1
  }
  return new CreateTableCommand(schema)
}

export const CreateDBTable = async (
  table: DBTable,
  completionCallback: (err: Error | null, data: CreateTableOutput | null) => void = (err, data) => {
    if (err && !err.message.includes('Cannot create preexisting table')) {
      logger.error(err)
    } else if (data) {
      logger.debug(`Table created successfully: ${data.TableDescription!.TableName}`)
    }
  }
) => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 2000))
    const res = await dynamo.send(tableToDefinition(table), { requestTimeout: 10000 })
    if (res) {
      completionCallback(null, res)
    }
  } catch (err) {
    completionCallback(err as Error, null)
  }
}
