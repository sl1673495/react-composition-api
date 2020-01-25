import React from 'react';
declare type Selector<T extends object, S> = (store: T) => S;
/**
 * 在组件中读取全局状态
 * 需要通过传入的函数中收集依赖
 */
export declare const useStore: <T extends object, S>(selector: Selector<T, S>) => S;
/**
 * 在mutation执行时不收集依赖 优化型能用
 */
export declare const createMutations: <T extends Record<any, Function>>(mutations: T) => T;
export declare const Provider: React.Provider<any>;
export {};
