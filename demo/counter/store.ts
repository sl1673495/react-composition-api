import { reactive } from '@vue/reactivity';

export const state = reactive({
  count: 0,
});

export const add = () => (state.count += 1);

export const store = reactive(state)

export type Store = typeof store;
