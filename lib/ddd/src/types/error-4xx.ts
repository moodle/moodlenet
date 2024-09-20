import {
  status4xx,
  status_code_4xx,
  status_desc_4xx,
  status_desc_by_code_4xx,
} from './reply-status'

export function assertValidMsg<val_type>(
  unk_val: unknown,
  validator: (unk_val: unknown) => unk_val is val_type,
  errorDetailsMessage = '',
): asserts unk_val is val_type {
  assertNot4xx('Bad Request', validator(unk_val), errorDetailsMessage)
}

export function assertNot4xx(
  status4xx: status4xx,
  not4xxCheck: boolean,
  detailMessage4xx = '',
): asserts not4xxCheck {
  if (!not4xxCheck) {
    throw new Error4xx(status4xx, detailMessage4xx)
  }
}

export class Error4xx extends Error {
  public code: status_code_4xx
  public desc: status_desc_4xx
  constructor(
    code_or_desc: status4xx,
    public details = '',
  ) {
    const _code = status4xx(code_or_desc)
    const _desc = status_desc_by_code_4xx[_code]
    super(`${_code}[${_desc}](${details ?? 'no details'})`)
    this.code = _code
    this.desc = _desc
  }
}
