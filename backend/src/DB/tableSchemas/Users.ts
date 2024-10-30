import { DBTable } from '../DBTable'
import { PKey } from '../annotations'
export class User implements DBTable {
  public static tableName: string = 'Users'
  public tableName: string = User.tableName
  @PKey
  public email: string
  public createdOn: number
  public name: string
  public constructor(email: string, createdOn: number, name: string) {
    this.email = email
    this.createdOn = createdOn
    this.name = name
  }

  public static getDefault() {
    return new User('', 0, '')
  }
  public getDefault() {
    return User.getDefault()
  }
}
