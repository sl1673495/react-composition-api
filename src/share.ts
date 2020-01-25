import { useEffect, useReducer, useRef } from 'react';
import { effect, stop, ReactiveEffect } from '@vue/reactivity';

export const useForceUpdate = () => {
  const [, forceUpdate] = useReducer(s => s + 1, 0);
  return forceUpdate;
};

export const useEffection = (...effectArgs: Parameters<typeof effect>) => {
  // 用一个ref存储effection
  // effect函数只需要初始化执行一遍
  const effectionRef = useRef<ReactiveEffect>();
  if (!effectionRef.current) {
    effectionRef.current = effect(...effectArgs);
  }

  // 卸载组件后取消effect
  const stopEffect = () => {
    stop(effectionRef.current!);
  };
  useEffect(() => stopEffect, []);

  return effectionRef.current
};
