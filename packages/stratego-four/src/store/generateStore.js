import { generateStore } from 'drizzle';
import drizzleOptions from './drizzleOptions';

export default () => {
  return generateStore({
    drizzleOptions,
    disableReduxDevTools: process.env.NODE_ENV === 'production'
  });
};

export { drizzleOptions };
