import React from 'react';
import { setup, reactive } from '../../src';

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
