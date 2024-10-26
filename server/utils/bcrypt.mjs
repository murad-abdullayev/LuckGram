import bcrypt from "bcrypt";
import { SALT_ROUNDS } from "./constants.mjs";

export function hashPassword(password) {
  const salt = bcrypt.genSaltSync(SALT_ROUNDS);
  const hashedPassword = bcrypt.hashSync(password, salt);
  return hashedPassword;
}

export function comparePasswords(password, hashedPassword) {
  return bcrypt.compareSync(password, hashedPassword);
}
