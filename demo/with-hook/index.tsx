import React from 'react';
import { setup } from '../../src';
import { reactive } from '@vue/reactivity';

export default setup(() => {
  const data = reactive({ message: 'World' });
  const change = () => (data.message = 'Hey');

  return () => {
    const [count, setCount] = React.useState(0);
    const add = () => setCount(c => c + 1);
    return (
      <>
        <section>
          <h1>Hello {data.message}</h1>
          <button onClick={change}>change</button>
        </section>
        <section>
          <h1>Count is {count}</h1>
          <button onClick={add}>+</button>
        </section>
      </>
    );
  };
});
