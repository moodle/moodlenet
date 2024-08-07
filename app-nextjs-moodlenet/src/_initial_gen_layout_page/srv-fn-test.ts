'use server';

import { resolve } from 'path';

type toOpts = {
  ms?: number;
  rej?: any;
};

async function to<T>(a: T, opt?: toOpts) {
  return new Promise<T>((resolve, reject) => {
    setTimeout(() => (opt?.rej ? reject(opt.rej) : resolve(a)), opt?.ms ?? 250);
  });
  return a;
}
export async function _test1(a: string, toopt?: toOpts) {
  return to(`hello ${a} test`, toopt);
}
