import express, { Router } from 'express';
import passport from 'passport';
import passportGoogle from "passport-google-oauth20";
import { verify } from '../db';

// import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from "../config";
const GoogleStrategy = passportGoogle.Strategy;

const GOOGLE_CLIENT_ID='760051383014-iln3njej3ij9otp0jufrkvo1lu40i6k4.apps.googleusercontent.com'
const GOOGLE_CLIENT_SECRET='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'

/*
passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/redirect",
    },
    (accessToken, refreshToken, profile, done) => {
      console.log('gauth token ' , accessToken, refreshToken)
      verify('https://accounts.google.com', profile, done)
    }
  )
);*/
passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: '/_/moodlenet-gauth/a/oauth2/redirect/google',
  scope: [ 'profile' ],
  state: true
},
(accessToken, refreshToken, profile, done) => {
  console.log('gauth token ' , accessToken, refreshToken)
  verify('https://accounts.google.com', profile, done)
}
));

// Configure the Facebook strategy for use by Passport.
//
// OAuth 2.0-based strategies require a `verify` function which receives the
// credential (`accessToken`) for accessing the Facebook API on the user's
// behalf, along with the user's profile.  The function must invoke `cb`
// with a user object, which will be set at `req.user` in route handlers after
// authentication.

/*
 passport.use(new GoogleStrategy({
  clientID: process.env['GOOGLE_CLIENT_ID'],
  clientSecret: process.env['GOOGLE_CLIENT_SECRET'],
  callbackURL: '/oauth2/redirect/google',
  scope: [ 'profile' ],
  state: true
},
function(accessToken:any, refreshToken:any, profile:any, cb:any) {
  verify('https://accounts.google.com', profile, cb)
}));
*/

// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  In a
// production-quality application, this would typically be as simple as
// supplying the user ID when serializing, and querying the user record by ID
// from the database when deserializing.  However, due to the fact that this
// example does not have a database, the complete Facebook profile is serialized
// and deserialized.
passport.serializeUser(function(user:any, cb) {
  process.nextTick(function() {
    cb(null, { id: user.id, username: user.username, name: user.name });
  });
});

passport.deserializeUser(function(user:any, cb) {
  process.nextTick(function() {
    return cb(null, user);
  });
});

  const router:Router = express.Router();


/* GET /login
 *
 * This route prompts the user to log in.constconst
 *
 * The 'login' view renders an HTML page, which contain a button prompting the
 * user to sign in with Google.  When the user clicks this button, a request
 * will be sent to the `GET /login/federated/accounts.google.com` route.
 */
router.get('/login', function(_, res) {
  res.render('login');
});

/* GET /login/federated/accounts.google.com
 *
 * This route redirects the user to Google, where they will authenticate.
 *
 * Signing in with Google is implemented using OAuth 2.0.  This route initiates
 * an OAuth 2.0 flow by redirecting the user to Google's identity server at
 * 'https://accounts.google.com'.  Once there, Google will authenticate the user
 * and obtain their consent to release identity information to this app.
 *
 * Once Google has completed their interaction with the user, the user will be
 * redirected back to the app at `GET /oauth2/redirect/accounts.google.com`.
 */
router.get('/login/federated/google', passport.authenticate('google'));

/*
    This route completes the authentication sequence when Google redirects the
    user back to the application.  When a new user signs in, a user account is
    automatically created and their Google account is linked.  When an existing
    user returns, they are signed in to their linked account.
*/
 router.get('/oauth2/redirect/google', passport.authenticate('google', {
  successReturnToOrRedirect: '/',
  failureRedirect: '/login',
}));

router.get('/test/oauth2/redirect/google', (req, res)=>{
  res.json(req.query);
});

/* POST /logout
 *
 * This route logs the user out.
 */
router.post('/logout', function(req, res) {
  req.logout({}, ()=>console.log('logout'));
  res.redirect('/');
});

export default router