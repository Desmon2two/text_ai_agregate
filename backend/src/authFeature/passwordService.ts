import bcrypt from "bcrypt";

async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  const hash = await bcrypt.hash(password, saltRounds);
  return hash;
}
function checkPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export default {
  hashPassword,
  checkPassword,
};
