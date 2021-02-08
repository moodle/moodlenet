import Argon from 'argon2';
import { resolve } from 'path';
import * as Yup from 'yup';
import { once } from '../../../lib/helpers/misc';
import { UserAccountPersistence } from './persistence/types';

const PERSISTENCE_IMPL = process.env.USERACCOUNT_PERSISTENCE_IMPL;

export const getAccountPersistence = once(
  async (): Promise<UserAccountPersistence> => {
    const persistenceModule = Yup.string()
      .required()
      .default('arango')
      .validateSync(PERSISTENCE_IMPL);
    return require(resolve(__dirname, 'persistence', 'impl', persistenceModule));
  }
);

export const ArgonPwdHashOpts: Parameters<typeof Argon.hash>[1] = {
  memoryCost: 100000,
  timeCost: 8,
  parallelism: 4,
  type: Argon.argon2id
};
