import React from 'react';
import { ThemeProvider } from 'styled-components';
import { Drizzle } from 'drizzle';
import { DrizzleContext } from 'drizzle-react';
import generateStore, { drizzleOptions } from './store/generateStore';
import theme from './theme';
import GameBoard from './pages/GameBoard';

function App() {
  const drizzle = new Drizzle(drizzleOptions, generateStore());

  return (
    <DrizzleContext.Provider drizzle={drizzle}>
      <ThemeProvider theme={theme}>
        <GameBoard />
      </ThemeProvider>
    </DrizzleContext.Provider>
  );
}

export default App;
