import UserModel, { User } from "../model/user.model";

export function registerUser(input: Partial<User>) {
  return UserModel.create(input);
}

export function loginUser(email: string) {
  return UserModel.findOne({ email: email }).exec();
}
