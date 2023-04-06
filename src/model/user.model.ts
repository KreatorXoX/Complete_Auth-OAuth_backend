import { prop, getModelForClass, pre } from "@typegoose/typegoose";
import { Severity } from "@typegoose/typegoose/lib/internal/constants";
import { modelOptions } from "@typegoose/typegoose/lib/modelOptions";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import { DocumentType } from "@typegoose/typegoose/lib/types";

@pre<User>("save", async function () {
  if (!this.isModified("password")) return;

  const hashedPassword = await bcrypt.hash(this.password, 10);

  this.password = hashedPassword;
  return;
})
@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
  options: {
    // because we are expecting password
    // reset code to be string or null
    allowMixed: Severity.ALLOW,
  },
})
export class User {
  @prop({ lowercase: true, required: true, unique: true })
  email: string;

  @prop({ required: true })
  firstName: string;
  @prop({ required: true })
  lastName: string;

  @prop({ required: true })
  password: string;

  @prop({ required: true, default: () => uuidv4() })
  verificationCode: string;

  @prop()
  passwordResetCode: string | null;

  @prop({ default: false })
  verified: boolean;

  async validatePassword(this: DocumentType<User>, enteredPassword: string) {
    try {
      return await bcrypt.compare(enteredPassword, this.password);
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}

const UserModel = getModelForClass(User);

export default UserModel;
