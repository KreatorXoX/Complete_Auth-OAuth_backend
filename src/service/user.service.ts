import UserModel, { User } from "../model/user.model";

// for client

export function findAllUsers() {
  return UserModel.find().select("_id firstName lastName").lean().exec();
}
export function findUserByIdForClient(id: string) {
  return UserModel.findById(id).select("_id firstName lastName").lean().exec();
}

// for server

export function createUser(input: Partial<User>) {
  return UserModel.create(input);
}

export function findUserById(id: string) {
  return UserModel.findById(id).exec();
}

export function findUserByMail(email: string) {
  return UserModel.findOne({ email: email }).exec();
}
