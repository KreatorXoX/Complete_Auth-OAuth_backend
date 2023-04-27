import UserModel, { User } from "../model/user.model";
import axios from "axios";
import qs from "qs";
import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import { DocumentType } from "@typegoose/typegoose";
import { update } from "lodash";
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

interface GoogleTokensResult {
  access_token: string;
  expires_in: Number;
  refresh_token: string;
  scope: string;
  id_token: string;
}
export async function getGoogleOAuthTokens({
  code,
}: {
  code: string;
}): Promise<GoogleTokensResult> {
  const url = "https://oauth2.googleapis.com/token";
  const values = {
    code,
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    redirect_uri: process.env.GOOGLE_OAUTH_REDIRECT_URL,
    grant_type: "authorization_code",
  };

  const res = await axios.post<GoogleTokensResult>(url, qs.stringify(values), {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  return res.data;
}

export function findAndUpdateUser(
  query: FilterQuery<DocumentType<User>>,
  update: UpdateQuery<DocumentType<User>>,
  options: QueryOptions = {}
) {
  return UserModel.findOneAndUpdate(query, update, options);
}
