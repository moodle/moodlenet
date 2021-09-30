export type PasswordVerifier = (_: { plainPwd: string; pwdHash: string }) => Promise<boolean>
export type PasswordHasher = (pwd: string) => Promise<string>
