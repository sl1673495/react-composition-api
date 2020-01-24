import React, { useReducer, useEffect } from 'react';
import { effect, stop } from '@vue/reactivity';

const setup = <Props extends {} = {}>(factory: () => React.FC<Props>) => {
  // 执行factory的过程中 会调用用户传入的setup
  // 在其中可以调用@vue/reactivity仓库里的api使用响应式能力
  const FunctionComponent = factory();

  const Wrapped: React.FC<Props> = props => {
    const forceUpdate = useForceUpdate();

    // 将React生成组件的函数包裹在effect中开启观察
    // 在观察到的值更新以后利用forceUpdate来强制渲染
    let Component = null as ReturnType<React.FunctionComponent>;
    const effection = effect(
      () => {
        Component = FunctionComponent(props);
      },
      {
        scheduler: forceUpdate,
      },
    );

    // 组件卸载后停止观察
    const stopEffect = () => {
      stop(effection);
    };
    useEffect(() => stopEffect, []);

    return Component;
  };

  return Wrapped;
};

export { setup };

const useForceUpdate = () => {
  const [, forceUpdate] = useReducer(s => s + 1, 0);
  return forceUpdate;
};
