import { reactive, computed, effect } from '@vue/reactivity';

export const state = reactive({
  count: 0,
  message: 'Hello',
  logs: [] as string[],
});

const plusOne = computed(() => state.count + 1);
const plusTwo = computed(() => plusOne.value + 1);

effect(() => {
  console.log('plusOne changed: ', plusOne);
});

const add = () => (state.count += 1);
const log = (log: string) => state.logs.unshift(log);
const chat = (message: string) => (state.message = message);

export const mutations = {
  // mutation
  add,
  log,
  chat,
};

export const store = {
  state,
  computed: {
    plusOne,
    plusTwo,
  },
};

export type Store = typeof store;
