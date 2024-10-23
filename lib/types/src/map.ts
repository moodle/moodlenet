import { DeepComplete } from './-deep-requires'

export type splitMap<T, right extends keyof T> = [Pick<T, right>, Omit<T, right>]

export type _any = any
export type _any_k = keyof _any

export type map<t = _any, k extends _any_k = _any_k> = Record<k, t>
 type m_map<t = _any, k extends _any_k = _any_k> = map<t, k> | void | undefined | null | unknown

// discriminate maps
export type d_m<nmap extends m_map, p extends _any_k> = discriminated_map<nmap, p>
export type discriminated_map<nmap extends m_map, p extends _any_k> = {
  [name in keyof nmap]: { [n in p]: name } & nmap[name]
}

// discriminated unions
export type discriminated_union<
  nmap extends m_map,
  p extends _any_k,
  keys extends keyof nmap = keyof nmap,
> = d_m<nmap, p>[keys]
export type d_u<
  nmap extends m_map,
  p extends _any_k,
  keys extends keyof nmap = keyof nmap,
> = discriminated_union<nmap, p, keys>
// >[keyof d_m<nmap, p>]

// union discrimination
export type d_u__discrimination<
  du extends { [k in d_prop]: string },
  d_prop extends keyof du,
  k extends du[d_prop],
> = du extends { [n in d_prop]: k } ? du : never
export type d_u__d<
  du extends { [k in d_prop]: string },
  d_prop extends keyof du,
  k extends du[d_prop],
> = d_u__discrimination<du, d_prop, k>

export type d_t_m<nmap extends m_map> = discriminated_tuple_map<nmap>
export type discriminated_tuple_map<nmap extends m_map> = {
  [name in keyof nmap]: nmap[name] extends never | void | undefined
    ? readonly [name]
    : readonly [name, nmap[name]]
}

export type discriminated_tuple_union<
  nmap extends m_map,
  keys extends keyof nmap = keyof nmap,
> = d_t_m<nmap>[keys]
export type d_t_u<
  nmap extends m_map,
  keys extends keyof nmap = keyof nmap,
> = discriminated_tuple_union<nmap, keys>

// discr_map<nmap, p> extends infer m ? m[keyof m] : never

export type deep_partial<t> = {
  [P in keyof t]?: t[P] extends (_: _any) => _any ? t[P] : t[P] extends object ? deep_partial<t[P]> : t[P]
}

export type deep_partial_props<t> = {
  [P in keyof t]?: t[P] extends _any[] | ((_: _any) => _any) ? t[P] : t[P] extends object ? deep_partial_props<t[P]> : t[P]
}

// export type deep_required<t> = DeepComplete<t>
