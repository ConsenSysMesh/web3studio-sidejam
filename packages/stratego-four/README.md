<h1 align="center">
  SideJam
  <br/>
</h1>

<h4 align="center">
  Stratego4
</h4>

## Overview

This repo holds the code and development assets for a Stratego4 implementation with SideJame tech.

## Development

This project uses Geth for local development. To start up the environment, run `yarn up geth`. This will spin up geth configured for development. A Blockchain only needs to be started once. When you're done, you can stop it with `yarn down`.

If you want to use (ganache|pantheon) instead, use `yarn up <name>`. Just in case you wanted to test it on different chains.

You can also see a block explorer by visiting [localhost:8080](http://localhost:8080).

Once started, run `yarn start` too see the app in the development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

It's recommended that you disable MetaMask or any in-browser web3 clients as the dev environment assumes connecting to the default accounts from Pantheon.

The page will reload if you make edits.

You will also see any lint errors in the console.

## License

As per usual, we are publishing under the [Apache 2.0 License](LICENSE).
