# react-composition-api

Use Vue3 reactivity ability in React

## Docs
https://sl1673495.github.io/react-composition-api

## Why
1. 直接引入`@vue/reacivity`，完全使用Vue3的reactivity能力 拥有`computed`, `effect`等各种能力，并且对于`set`和`map`也提供了响应式的能力。  
2. `vue-next`仓库内部完整的测试用例。
2. 完善的TypeScript类型支持。

## Usage
```
npm i react-vue-reactivity -S
npm i @vue/reactivity -S
```

支持[@vue/reactivity](https://www.npmjs.com/package/@vue/reactivity)内部提供的所有api，并在React组件中使用。  

最简单的demo如下: 

```tsx
import { setup } from 'react-vue-reactivity';
import { reactive } from '@vue/reactivity'

export default setup(() => {
  const data = reactive({ message: 'World' });

  const change = () => (data.message = 'Hey');

  return props => (
    <>
      <span>Hello {data.message}</span>
      <button onClick={change}>change</button>
    </>
  );
});
```

除了`setup`以外，其他所有的api都是Vue内部提供的。  

具体支持的api，可以看`vue-next`仓库中的导出的api

```ts
export { ref, isRef, toRefs, Ref, UnwrapRef } from './ref'
export {
  reactive,
  isReactive,
  readonly,
  isReadonly,
  shallowReadonly,
  toRaw,
  markReadonly,
  markNonReactive
} from './reactive'
export {
  computed,
  ComputedRef,
  WritableComputedRef,
  WritableComputedOptions,
  ComputedGetter,
  ComputedSetter
} from './computed'
export {
  effect,
  stop,
  pauseTracking,
  resumeTracking,
  ITERATE_KEY,
  ReactiveEffect,
  ReactiveEffectOptions,
  DebuggerEvent
} from './effect'
export { lock, unlock } from './lock'
export { TrackOpTypes, TriggerOpTypes } from './operations'
```
注意`computed`、`ref`这些包装后的值没有提供自动解包功能，必须用`data.value`去读取和赋值。  

具体可以看文档中的`counter`和`todo`示例

## LICENSE

MIT
