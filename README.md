# react-composition-api
在React应用中使用@vue/reactivity中的所有响应式能力

1. 使用setup在组件中体验Vue-Composition-Api
2. 使用极简的api实现全局状态管理

## Docs
https://sl1673495.github.io/react-composition-api

## Why
1. 直接引入`@vue/reacivity`，完全使用Vue3的reactivity能力 拥有`computed`, `effect`等各种能力，并且对于`set`和`map`也提供了响应式的能力。  
2. `vue-next`仓库内部完整的测试用例。
3. 完善的TypeScript类型支持。
4. 完全复用`@vue/reacivity`实现超强的**全局状态管理能力**。

## Usage
```
npm i react-vue-reactivity -S
npm i @vue/reactivity -S
```

支持[@vue/reactivity](https://www.npmjs.com/package/@vue/reactivity)内部提供的所有api，并在React组件中使用。  

最简单的demo如下: 

### 全局状态管理
```ts
// store.ts
import { reactive, computed, effect } from '@vue/reactivity';

export const state = reactive({
  count: 0,
});

const plusOne = computed(() => state.count + 1);

effect(() => {
  console.log('plusOne changed: ', plusOne);
});

const add = () => (state.count += 1);

export const mutations = {
  // mutation
  add,
};

export const store = {
  state,
  computed: {
    plusOne,
  },
};

export type Store = typeof store;
```
```tsx
// Index.tsx
function Count() {
  const countState = useStore((store: Store) => {
    const { state, computed } = store;
    const { count } = state;
    const { plusOne } = computed;

    return {
      count,
      plusOne,
    };
  });

  return (
    <Card hoverable style={{ marginBottom: 24 }}>
      <h1>计数器</h1>
      <div className="chunk">
        <div className="chunk">store中的count现在是 {countState.count}</div>
        <div className="chunk">computed值中的plusOne现在是 {countState.plusOne.value}</div>
         <Button onClick={mutations.add}>add</Button>
      </div>
    </Card>
  );
}

export default () => {
  return (
    <Provider value={store}>
       <Count />
    </Provider>
  );
};
```
可以看出来，store的定义完全复用了`@vue/reactivity`中的能力，而不会引入额外的学习成本，并且里面的所有能力都可以完美支持。  

具体的代码和效果可以看文档中相对复杂的示例：  
https://sl1673495.github.io/react-composition-api/store


### 组件内部使用setup
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

## LICENSE

MIT
