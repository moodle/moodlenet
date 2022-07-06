
import ConnSqLite from 'connect-sqlite3';
import express from 'express';
import session from 'express-session';
import passport from 'passport';

import createError from 'http-errors';

import path from 'path';
import authRouter from './routes/auth';
import indexRouter from './routes/index';

const SQLiteStore = ConnSqLite(session)
export function creatApp(app: express.Express) {
  app.use(express.static(path.resolve(__dirname, '..', '..', 'public')))
  app.engine('ejs', require('ejs').__express)
  app.set('views', path.resolve(__dirname, '..', '..', 'views'))
  console.log('yyyyyyyyyyyyy', path.join(__dirname, 'views'))
  app.set('view engine', 'ejs')


  app.use(session({
    secret: 'keyboard cat',
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    store: new SQLiteStore({ db: 'sessions.db', dir: 'var/db' })
  }))

  app.use(passport.authenticate('session'));

  app.use(function (req, res, next) {
    var msgs = (req.session as any).messages || [];
    res.locals.messages = msgs;
    res.locals.hasMessages = !!msgs.length;
    (req.session as any).messages = [];
    next();
  });

  app.use('/', indexRouter)
  app.use('/a', authRouter)

  // catch 404 and forward to error handler
  app.use(function (_: any, __: any, next) {
    next(createError(404));
  });

  // error handler
  app.use(function (err: any, req: any, res: any) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });
  // app.use('oauth',router) xx 
}
