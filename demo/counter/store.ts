import { reactive } from '@vue/reactivity';

export const state = reactive({
  count: 0,
});

const add = () => (state.count += 1);

export const mutations = {
  // mutation
  add,
};

export const store = {
  state: reactive(state),
};

export type Store = typeof store;
