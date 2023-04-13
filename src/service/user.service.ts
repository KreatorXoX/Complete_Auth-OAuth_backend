import UserModel, { User } from "../model/user.model";

export function createUser(input: Partial<User>) {
  return UserModel.create(input);
}

export function getUsers() {
  return UserModel.find();
}

export function findUserById(id: string) {
  return UserModel.findById(id).exec();
}

export function findUserByMail(email: string) {
  return UserModel.findOne({ email: email }).exec();
}
