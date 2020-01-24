import { ComputedRef } from './computed';
import { CollectionTypes } from './collectionHandlers';
declare const isRefSymbol: unique symbol;
export interface Ref<T = any> {
    [isRefSymbol]: true;
    value: UnwrapRef<T>;
}
export declare function isRef<T>(r: Ref<T> | T): r is Ref<T>;
export declare function ref<T extends Ref>(raw: T): T;
export declare function ref<T>(raw: T): Ref<T>;
export declare function ref<T = any>(): Ref<T>;
export declare function toRefs<T extends object>(object: T): {
    [K in keyof T]: Ref<T[K]>;
};
declare type UnwrapArray<T> = {
    [P in keyof T]: UnwrapRef<T[P]>;
};
declare type BaseTypes = string | number | boolean;
export declare type UnwrapRef<T> = {
    cRef: T extends ComputedRef<infer V> ? UnwrapRef<V> : T;
    ref: T extends Ref<infer V> ? UnwrapRef<V> : T;
    array: T extends Array<infer V> ? Array<UnwrapRef<V>> & UnwrapArray<T> : T;
    object: {
        [K in keyof T]: UnwrapRef<T[K]>;
    };
}[T extends ComputedRef<any> ? 'cRef' : T extends Array<any> ? 'array' : T extends Ref | Function | CollectionTypes | BaseTypes ? 'ref' : T extends object ? 'object' : 'ref'];
export {};
