import { Model, Document } from "mongoose"

interface User {
  firstName: string
  lastName: string
  email: string
  password: string
  role: "Admin" | "User"
}

export interface UserDocument extends User, Document {}

export interface UserModel extends Model<UserDocument> {
  checkCredentials(email: string, password: string): Promise<UserDocument | null>
}
