import React, { useReducer, useEffect, useRef } from 'react';
import { effect, stop, ReactiveEffect } from '@vue/reactivity';

const setup = <Props extends {} = {}>(factory: () => React.FC<Props>) => {
  // 执行factory的过程中 会调用用户传入的setup
  // 在其中可以调用@vue/reactivity仓库里的api使用响应式能力
  const FunctionComponent = factory();

  const EffectWrapper: React.FC<Props> = props => {
    const forceUpdate = useForceUpdate();

    // 将React的FunctionComponent函数包裹在effect中执行 以收集依赖
    // 依赖值更新以后利用forceUpdate来强制重新渲染组件
    // effect只需要执行一次就够了
    const effectionRef = useRef<ReactiveEffect>();
    if (!effectionRef.current) {
      effectionRef.current = effect(
        () =>  FunctionComponent(props),
        { scheduler: forceUpdate, lazy: true },
      );
    }

    // 生成组件实例
    const Component = effectionRef.current()

    // 组件卸载后停止观察
    const stopEffect = () => {
      stop(effectionRef.current!);
    };
    useEffect(() => stopEffect, []);

    return Component;
  };

  return EffectWrapper;
};

export { setup };

const useForceUpdate = () => {
  const [, forceUpdate] = useReducer(s => s + 1, 0);
  return forceUpdate;
};
