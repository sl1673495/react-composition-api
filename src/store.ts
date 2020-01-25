import React, { useContext } from 'react';
import { pauseTracking, resumeTracking } from '@vue/reactivity';
import { useForceUpdate, useEffection } from './share';

type Selector<T extends object, S> = (store: T) => S;

const StoreContext = React.createContext<any>(null);

const useStoreContext = () => {
  const contextValue = useContext(StoreContext);
  if (!contextValue) {
    throw new Error(
      'could not find store context value; please ensure the component is wrapped in a <Provider>',
    );
  }
  return contextValue;
};

/**
 * 在组件中读取全局状态
 * 需要通过传入的函数中收集依赖
 */
export const useStore = <T extends object, S>(selector: Selector<T, S>): S => {
  const forceUpdate = useForceUpdate();
  const store = useStoreContext();

  const effection = useEffection(() => selector(store), {
    scheduler: forceUpdate,
    lazy: true,
  });

  const value = effection();
  return value;
};

/**
 * 在mutation执行时不收集依赖 优化型能用
 */
export const createMutations = <T extends Record<any, Function>>(mutations: T): T => {
  return Object.keys(mutations).reduce((prev, key) => {
    const fn = mutations[key];
    prev[key] = (...args: any[]) => {
      pauseTracking();
      fn(...args);
      resumeTracking();
    };
    return prev;
  }, {} as any);
};

export const Provider = StoreContext.Provider;
