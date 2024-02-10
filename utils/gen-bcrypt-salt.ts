import { genSalt } from "bcryptjs";

const { BCRYPT_SALT } = process.env;

export const bcryptSalt = async () => genSalt(Number(BCRYPT_SALT));
