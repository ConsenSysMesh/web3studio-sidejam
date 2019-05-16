import React from 'react';
import { ThemeProvider } from 'styled-components';
import { Drizzle } from 'drizzle';
import { drizzleReactHooks } from 'drizzle-react';
import { Provider } from 'react-redux';
import generateStore, { drizzleOptions } from './store/generateStore';
import theme from './theme';
import PlayField from './game/PlayField';

/**
 * Root Component of the App
 *
 * @returns {React.Element} - Rendered app
 */
function App() {
  const store = generateStore();
  const drizzle = new Drizzle(drizzleOptions, store);

  return (
    <Provider store={store}>
      <drizzleReactHooks.DrizzleProvider drizzle={drizzle}>
        <ThemeProvider theme={theme}>
          <drizzleReactHooks.Initializer>
            <PlayField />
          </drizzleReactHooks.Initializer>
        </ThemeProvider>
      </drizzleReactHooks.DrizzleProvider>
    </Provider>
  );
}

export default App;
