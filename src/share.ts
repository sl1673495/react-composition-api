import { useEffect, useReducer, useRef } from 'react';
import { effect, stop, ReactiveEffect } from '@vue/reactivity';

type TVueEffectParameters = Parameters<typeof effect>;

export const useForceUpdate = () => {
  const [, forceUpdate] = useReducer(s => s + 1, 0);
  return forceUpdate;
};

export const useEffection = (
  fn: TVueEffectParameters[0], 
  options?: TVueEffectParameters[1], 
  changes?: any[]
) => {
  // 用一个ref存储effection
  // effect函数只需要初始化执行一遍
  const effectionRef = useRef<{
    effect: ReactiveEffect,
    changes: any[] | undefined
  }>();
  if (!effectionRef.current) {
    effectionRef.current = {
      effect: effect(fn, options),
      changes: changes,
    };
  } else if (changes && changes.length && compare(effectionRef.current.changes, changes)) {
    // 当旧的变化数据与新的变化数据的索引数据上的不一致
    // 我们需要销毁之前的effect
    stop(effectionRef.current.effect);
    // 重新创建新的effect
    effectionRef.current = {
      effect: effect(fn, options),
      changes: changes,
    };
  }

  // 卸载组件后取消effect
  const stopEffect = () => {
    stop(effectionRef.current?.effect!);
  };
  useEffect(() => stopEffect, []);

  return effectionRef.current.effect;
};

function compare(oldChanges: any[] | undefined, newChanges: any[]) {
  oldChanges = oldChanges || [];
  if (oldChanges.length !== newChanges.length) return true;
  for (let i = 0; i < newChanges.length; i++) {
    if (oldChanges[i] !== newChanges[i]) return true;
  }
  return false;
}
