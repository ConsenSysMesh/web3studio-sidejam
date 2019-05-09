import React from 'react';
import { Text, Link } from 'rimble-ui';
import logo from '../logo.svg';

export default () => (
  <header className="App-header">
    <img src={logo} className="App-logo" alt="logo" />
    <Text>
      Edit <code>src/App.js</code> and save to reload.
    </Text>
    <Link href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
      Learn React
    </Link>
  </header>
);
