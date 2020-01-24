import { ReactiveEffect } from './effect';
import { Ref, UnwrapRef } from './ref';
export interface ComputedRef<T = any> extends WritableComputedRef<T> {
    readonly value: UnwrapRef<T>;
}
export interface WritableComputedRef<T> extends Ref<T> {
    readonly effect: ReactiveEffect<T>;
}
export declare type ComputedGetter<T> = () => T;
export declare type ComputedSetter<T> = (v: T) => void;
export interface WritableComputedOptions<T> {
    get: ComputedGetter<T>;
    set: ComputedSetter<T>;
}
export declare function computed<T>(getter: ComputedGetter<T>): ComputedRef<T>;
export declare function computed<T>(options: WritableComputedOptions<T>): WritableComputedRef<T>;
