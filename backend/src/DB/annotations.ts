import { DBTable } from './DBTable'

export const TagMap: Record<
  `${string}${'PKey' | 'SKey' | 'LocalIndex' | 'GlobalIndex'}`,
  string | LIndex[] | GIndex[]
> = {}

// TODO make this work with metadata
export const PKey = <T extends DBTable>(target: T, key: string) => {
  TagMap[`${target.getDefault().tableName}PKey`] = key
}

export const SKey = <T extends DBTable>(target: T, key: string) => {
  TagMap[`${target.getDefault().tableName}SKey`] = key
}
export type LIndex = {
  name: string
  sKey?: string
}

export const LocalIndex =
  (indexName: string) =>
  <T extends DBTable>(target: T, key: string) => {
    const targetName = target.getDefault().tableName
    const localIndexes = (TagMap[`${targetName}LocalIndex`] || []) as LIndex[]
    localIndexes.push({ name: indexName, sKey: key })
    TagMap[`${targetName}LocalIndex`] = localIndexes
  }

export type GIndex = LIndex & {
  pKey?: string
}
export const GlobalIndex =
  (indexName: string, partition = false) =>
  <T extends DBTable>(target: T, key: string) => {
    const targetName = target.getDefault().tableName
    const globalIndexes = (TagMap[`${targetName}GlobalIndex`] || []) as GIndex[]
    if (partition) {
      globalIndexes.push({ pKey: key, name: indexName })
    } else {
      globalIndexes.push({ sKey: key, name: indexName })
    }
    TagMap[`${targetName}GlobalIndex`] = globalIndexes
  }
