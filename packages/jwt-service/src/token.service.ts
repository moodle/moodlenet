import jwt from 'jsonwebtoken';
import moment from 'moment';

const tokenTypes = {
  ACCESS: 'access',
  REFRESH: 'refresh',
  RESET_PASSWORD: 'resetPassword',
  VERIFY_EMAIL: 'verifyEmail',
  GUEST_TEMP: 'guestTemp',
};

module.exports = {
  tokenTypes,
};
const config = {
  jwt: { secret: 'affrewqqaa', verifyEmailExpirationMinutes: 60 * 24 * 3, accessExpirationMinutes: 60 * 24 * 3, refreshExpirationDays: 30 },
}

/**
 * Generate token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {string} type
 * @param {string} [secret]
 * @returns {string}
 */
 export const generateToken = (ObjectId: string, expires: any, type: string, data: any, secret = config.jwt.secret) => {
  const payload = {
    sub: ObjectId,
    iat: moment().unix(),
    exp: expires.unix(),
    type,
    data
  };
  return jwt.sign(payload, secret);
};

/**
 * Verify token and return token doc (or throw an error if it is not valid)
 * @param {string} token
 * @param {string} type
 * @returns {Promise<Token>}
 */
 export const verifyToken = async (token: string, type: string) => {
  const payload = jwt.verify(token, config.jwt.secret);
  /* const tokenDoc = await Token.findOne({ token, type, user: payload.sub, blacklisted: false });
  if (!tokenDoc) {
    throw new Error('Token not found');
  }
  return tokenDoc; */
};

/**
 * Generate auth tokens
 * @param {User} user
 * @returns {Promise<Object>}
 */
 export const generateAuthTokens = async (user:any) => {
  const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
  const accessToken = generateToken(user.id, accessTokenExpires, tokenTypes.ACCESS, JSON.stringify(user));

  const refreshTokenExpires = moment().add(config.jwt.refreshExpirationDays, 'days');
  const refreshToken = generateToken(user.id, refreshTokenExpires, tokenTypes.REFRESH, JSON.stringify(user));

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate(),
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires.toDate(),
    },
  };
};

/**
 * Generate reset password token
 * @param {string} email
 * @returns {Promise<string>}
 */
const generateResetPasswordToken = async (email: string) => {
  /* const user = await userService.getUserByEmail(email);
   if (!user) {
     throw new ApiError(httpStatus.NOT_FOUND, 'No users found with this email');
   }
   const expires = moment().add(config.jwt.resetPasswordExpirationMinutes, 'minutes');
   const resetPasswordToken = generateToken(user.id, expires, tokenTypes.RESET_PASSWORD);
   await saveToken(resetPasswordToken, user.id, expires, tokenTypes.RESET_PASSWORD);
   return resetPasswordToken; */
};

/**
 * Generate verify email token
 * @param {User} user
 * @returns {Promise<string>}
 */
export const signupToken = (user: any) => {
  const expires = moment().add(config.jwt.verifyEmailExpirationMinutes, 'minutes');
  const verifyEmailToken = generateToken(user.id, expires, tokenTypes.VERIFY_EMAIL, JSON.stringify(user));
  //  await saveToken(verifyEmailToken, user.id, expires, tokenTypes.VERIFY_EMAIL);
  return verifyEmailToken;
};

export const jswParse= (token:string)=> {
  const parsed = jwt.verify(token, config.jwt.secret)
  return typeof parsed === 'string' ? parsed : JSON.parse(parsed.data)
}

/* test

const user = {id:3333, email:'etto@etto.it'};
const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
const accessToken = generateToken(user.id, accessTokenExpires, tokenTypes.ACCESS, JSON.stringify({pippo:'pppp', pape:5}));
console.log(accessToken);

const payload = jwt.verify(accessToken, config.jwt.secret)
const data = JSON.parse(payload.data)
console.log('payload ', data)
*/
