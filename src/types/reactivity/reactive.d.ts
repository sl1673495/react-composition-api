import { UnwrapRef, Ref } from './ref';
declare type UnwrapNestedRefs<T> = T extends Ref ? T : UnwrapRef<T>;
export declare function reactive<T extends object>(target: T): UnwrapNestedRefs<T>;
export declare function readonly<T extends object>(target: T): Readonly<UnwrapNestedRefs<T>>;
export declare function shallowReadonly<T extends object>(target: T): Readonly<{
    [K in keyof T]: UnwrapNestedRefs<T[K]>;
}>;
export declare function isReactive(value: unknown): boolean;
export declare function isReadonly(value: unknown): boolean;
export declare function toRaw<T>(observed: T): T;
export declare function markReadonly<T>(value: T): T;
export declare function markNonReactive<T>(value: T): T;
export {};
