import React from 'react';
import { ThemeProvider } from 'styled-components';
import { Drizzle } from 'drizzle';
import { DrizzleContext } from 'drizzle-react';
import generateStore, { drizzleOptions } from './store/generateStore';
import theme from './theme';
import PlayField from './pages/PlayField';

function App() {
  const drizzle = new Drizzle(drizzleOptions, generateStore());

  return (
    <DrizzleContext.Provider drizzle={drizzle}>
      <ThemeProvider theme={theme}>
        <PlayField />
      </ThemeProvider>
    </DrizzleContext.Provider>
  );
}

export default App;
