import { User } from '../../DB/tableSchemas/Users'

export interface IUserService {
  createUser(email: string): Promise<User>
  getUser(email: string): Promise<User>
  listUsers(
    count: number,
    lastPageToken?: string
  ): Promise<{ users: User[]; nextPageToken?: string }>
  updateUser(user: User): Promise<User>
  deleteUser(email: string): Promise<void>
}
