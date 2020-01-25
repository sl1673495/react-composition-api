import React from 'react';
import { setup } from '../../src';
import { reactive } from '@vue/reactivity'

export default setup(() => {
  const data = reactive({ message: 'World' });

  const change = () => (data.message = 'Hey');

  return props => (
    <>
      <h1>Hello {data.message}</h1>
      <button onClick={change}>change</button>
    </>
  );
});
