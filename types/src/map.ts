type _any = any
type _any_k = keyof _any

export type map<t = _any, k extends _any_k = _any_k> = Record<k, t>
export type m_map<t = _any, k extends _any_k = _any_k> =
  | map<t, k>
  | void
  | undefined
  | null
  | unknown

export type _DEF_DISCR_PROP = '_discriminant_name'
export type _ddp = _DEF_DISCR_PROP
export type d_m<nmap extends m_map, p extends _any_k = _DEF_DISCR_PROP> = discriminated_map<nmap, p>
export type discriminated_map<nmap extends m_map, p extends _any_k = _DEF_DISCR_PROP> = {
  [name in keyof nmap]: { [n in p]: name } & nmap[name]
}

export type d_u<nmap extends m_map, p extends _any_k = _DEF_DISCR_PROP> = discriminated_union<
  nmap,
  p
>
export type discriminated_union<nmap extends m_map, p extends _any_k = _DEF_DISCR_PROP> = d_m<
  nmap,
  p
>[keyof d_m<nmap, p>]

export type d_t_m<nmap extends m_map> = discriminated_tuple_map<nmap>
export type discriminated_tuple_map<nmap extends m_map> = {
  [name in keyof nmap]: nmap[name] extends never | void | undefined
    ? readonly [name]
    : readonly [name, nmap[name]]
}

export type discriminated_tuple_union<nmap extends m_map> = d_t_m<nmap>[keyof nmap]
export type d_t_u<nmap extends m_map> = discriminated_tuple_union<nmap>

// discr_map<nmap, p> extends infer m ? m[keyof m] : never

export type _t<t> = { [k in string & keyof t]: t[k] }
