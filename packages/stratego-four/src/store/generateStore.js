import { generateStore } from 'drizzle';
import drizzleOptions from './drizzleOptions';
import gameSaga from '../game/gameSaga';
import gameReducer from '../game/gameReducer';

export default () => {
  return generateStore({
    drizzleOptions,
    appSagas: [gameSaga],
    appReducers: {
      game: gameReducer
    },
    disableReduxDevTools: process.env.NODE_ENV === 'production'
  });
};

export { drizzleOptions };
