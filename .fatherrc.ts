import { IBundleOptions } from 'father';

const options: IBundleOptions = {
  doc: {
    title: 'react-vue-reactivity',
    base: process.env.NODE_ENV === 'production' ? '/react-composition-api/' : '',
    dest: 'docs',
    typescript: true,
  },
  cjs: {
    type: 'babel',
    minify: true,
  },
};

export default options;
