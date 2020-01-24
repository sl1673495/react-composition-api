import React from 'react';
import { setup } from '../../src/index';
import { reactive, computed, effect } from '@vue/reactivity'
import styles from './index.css';

const Counter: React.FC = setup(() => {
  const state = reactive({ count: 0 });
  const plusOne = computed(() => state.count + 1);

  effect(() => {
    console.log('current count changed', state.count);
  });

  effect(() => {
    console.log('current plusOne', plusOne.value);
  });

  const add = () => {
    state.count = state.count + 1;
  };

  return props => {
    return (
      <>
        <div>current count is {state.count}</div>
        <div>current plusOne is {plusOne.value}</div>

        <button onClick={add} className={styles.button}>
          {props.children}
        </button>
      </>
    );
  };
});

export default Counter;
