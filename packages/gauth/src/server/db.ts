import mkdirp from 'mkdirp';
import sqlite3 from 'sqlite3';

import { resolve } from 'path';

const myPath = resolve(__dirname, '..', '..', 'var', 'db');

mkdirp.sync(myPath);

export const db = new sqlite3.Database(myPath + '/todos.db');

// console.log('db start xxxxxxxxxxxxxxxxxxxxxxx', myPath );

db.serialize(function () {
  db.run("CREATE TABLE IF NOT EXISTS users ( \
    username TEXT UNIQUE, \
    hashed_password BLOB, \
    salt BLOB, \
    name TEXT \
  )");

  db.run("CREATE TABLE IF NOT EXISTS federated_credentials ( \
    user_id INTEGER NOT NULL, \
    provider TEXT NOT NULL, \
    subject TEXT NOT NULL, \
    PRIMARY KEY (provider, subject) \
  )");

  db.run("CREATE TABLE IF NOT EXISTS todos ( \
    owner_id INTEGER NOT NULL, \
    title TEXT NOT NULL, \
    completed INTEGER \
  )");
});

export function getUser(provider: string, profileId: string, cb: any) {
  db.get('SELECT * FROM federated_credentials WHERE provider = ? AND subject = ?', [provider,
    profileId], cb)
}

export function getUsers(cb: any) {
  db.all('SELECT * FROM federated_credentials', [], cb)
}

export function getUsersUsers(cb: any) {
  db.all('SELECT  rowid as id,  name, salt FROM users', [], cb)
}

export function insertCredential(provider: string, id: string, profileId: string, cbError: any) {
  db.run('INSERT INTO federated_credentials (user_id, provider, subject) VALUES (?, ?, ?)',
    [id, provider, profileId], cbError)
}

export function insertUser(provider: string, profile: any, cbError: any) {
  // displayName: string,
  // console.log('xxxxxxxxx insertUser ', profile)
  db.run('INSERT INTO users (name) VALUES (?)', [profile.displayName],
    function onInsert(err: any) {
      return err ? cbError(err) : insertCredential(provider, this.lastID + '', profile.id, cbError)
    });
}

export function getUserByRowId(row: any, cb: any) {
  // console.log('xxxxx getUserByRowId ', row)
  db.get('SELECT rowid AS id, * FROM users WHERE rowid = ?', [row.user_id],
    (err, row) => err ? cb(err) : !row ? cb(null, false) : cb(null, row))
}

export function verify(provider: string, profile: any, cb: any) { // provider =  'https://accounts.google.com'
  const getOrInsert = (row: any) => !row ? insertUser(provider, profile, cb) : getUserByRowId(row, cb)
  const chekRow = (err: any, row: any) => err ? cb(err) : getOrInsert(row)
  getUser(provider, profile.id, (err: any, _user: any) => {
    console.log('get user ', _user)
    chekRow(err, _user)
  })
}
