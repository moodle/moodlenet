import { Basic } from 'unsplash-js/dist/methods/photos/types'
import ashleywhitlatch from '../../static/img/contentBackup/ashleywhitlatch.jpg'
import dvlden from '../../static/img/contentBackup/dvlden.jpg'
import dvlden2 from '../../static/img/contentBackup/dvlden2.jpg'
import fakurian from '../../static/img/contentBackup/fakurian.jpg'
import fakurian2 from '../../static/img/contentBackup/fakurian2.jpg'
import gradienta from '../../static/img/contentBackup/gradienta.jpg'
import gradienta2 from '../../static/img/contentBackup/gradienta2.jpg'
import {
  default as gradienta3,
  default as gradienta4,
} from '../../static/img/contentBackup/gradienta3.jpg'
import gradienta5 from '../../static/img/contentBackup/gradienta5.jpg'
import hendrikkay from '../../static/img/contentBackup/hendrikkay.jpg'
import lukechesser from '../../static/img/contentBackup/lukechesser.jpg'
import lukechesser2 from '../../static/img/contentBackup/lukechesser2.jpg'
import mymind from '../../static/img/contentBackup/mymind.jpg'
import mymind2 from '../../static/img/contentBackup/mymind2.jpg'
import seanwsinclair from '../../static/img/contentBackup/seanwsinclair.jpg'
import vackground from '../../static/img/contentBackup/vackground.jpg'

export type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>
}

export const ContentBackupImages: RecursivePartial<Basic>[] = [
  {
    user: {
      first_name: 'mymind',
      links: {
        html: 'https://unsplash.com/@mymind',
      },
    },
    urls: {
      regular: mymind,
    },
  },
  {
    urls: { regular: seanwsinclair },
    user: {
      first_name: 'Sean Sinclair',
      links: { html: 'https://unsplash.com/@seanwsinclair' },
    },
  },
  {
    urls: { regular: fakurian },
    user: {
      first_name: 'Milad Fakurian',
      links: { html: 'https://unsplash.com/@fakurian' },
    },
  },
  {
    urls: { regular: fakurian2 },
    user: {
      first_name: 'Milad Fakurian',
      links: { html: 'https://unsplash.com/@fakurian' },
    },
  },
  {
    urls: { regular: mymind2 },
    user: {
      first_name: 'mymind',
      links: { html: 'https://unsplash.com/@mymind' },
    },
  },
  {
    urls: { regular: ashleywhitlatch },
    user: {
      first_name: 'Ashley Whitlatch',
      links: { html: 'https://unsplash.com/@ashleywhitlatch' },
    },
  },
  {
    urls: { regular: gradienta },
    user: {
      first_name: 'Gradienta',
      links: { html: 'https://unsplash.com/@gradienta' },
    },
  },
  {
    urls: { regular: gradienta2 },
    user: {
      first_name: 'Gradienta',
      links: { html: 'https://unsplash.com/@gradienta' },
    },
  },
  {
    urls: { regular: gradienta3 },
    user: {
      first_name: 'Gradienta',
      links: { html: 'https://unsplash.com/@gradienta' },
    },
  },
  {
    urls: { regular: gradienta4 },
    user: {
      first_name: 'Gradienta',
      links: { html: 'https://unsplash.com/@gradienta' },
    },
  },
  {
    urls: { regular: gradienta5 },
    user: {
      first_name: 'Gradienta',
      links: { html: 'https://unsplash.com/@gradienta' },
    },
  },
  {
    urls: { regular: fakurian },
    user: {
      first_name: 'Milad Fakurian',
      links: { html: 'https://unsplash.com/@fakurian' },
    },
  },
  {
    urls: { regular: fakurian },
    user: {
      first_name: 'Milad Fakurian',
      links: { html: 'https://unsplash.com/@fakurian' },
    },
  },
  {
    urls: { regular: hendrikkay },
    user: {
      first_name: 'Hendrik Kespohl',
      links: { html: 'https://unsplash.com/@hendrikkay' },
    },
  },
  {
    urls: { regular: lukechesser },
    user: {
      first_name: 'Luke Chesser',
      links: { html: 'https://unsplash.com/@lukechesser' },
    },
  },
  {
    urls: { regular: lukechesser2 },
    user: {
      first_name: 'Luke Chesser',
      links: { html: 'https://unsplash.com/@lukechesser' },
    },
  },
  {
    urls: { regular: vackground },
    user: {
      first_name: 'Vackground',
      links: { html: 'https://unsplash.com/@vackground' },
    },
  },
  {
    urls: { regular: dvlden },
    user: {
      first_name: 'Nenad Novaković',
      links: { html: 'https://unsplash.com/@dvlden' },
    },
  },
  {
    urls: { regular: dvlden2 },
    user: {
      first_name: 'Nenad Novaković',
      links: { html: 'https://unsplash.com/@dvlden' },
    },
  },
]
