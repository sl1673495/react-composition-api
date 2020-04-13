import React from 'react';
declare type Selector<T, S> = (store: T) => S;
/**
 * 在组件中读取全局状态
 * 需要通过传入的函数收集依赖
 */
export declare const useStore: <T, S>(selector: Selector<T, S>) => S;
export declare const Provider: React.Provider<any>;
export {};
