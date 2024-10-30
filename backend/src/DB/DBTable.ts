export interface DBTable {
  tableName: string
  getDefault: () => DBTable
}
