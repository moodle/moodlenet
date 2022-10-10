import { MutableRefObject } from 'react';
declare type RefT<T> = ((instance: T | null) => void) | MutableRefObject<T | null> | null;
export declare const useForwardedRef: <T>(ref: RefT<T>) => import("react").RefObject<T>;
export {};
//# sourceMappingURL=useForwardedRef.d.mts.map