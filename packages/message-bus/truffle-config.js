const ProviderEngine = require('web3-provider-engine');
const WebsocketProvider = require('web3-provider-engine/subproviders/websocket.js');
const {
  TruffleArtifactAdapter,
  CoverageSubprovider
} = require('@0x/sol-coverage');
const { RevertTraceSubprovider } = require('@0x/sol-trace');

require('dotenv').config();

const solcVersion = '0.5.4';
const defaultFromAddress = '0x627306090abab3a6e1400e9345bc60c78a8bef57';
const isVerbose = true;
/**
 * Create's a test provider using 0x tracing and coverage
 *
 * @param {string} projectRoot - path of project using this config
 * @returns {ProviderEngine} A web3 provider
 * @private
 */
const createTestProvider = projectRoot => {
  const testProvider = new ProviderEngine();
  const artifactAdapter = new TruffleArtifactAdapter(
    `${projectRoot}`,
    solcVersion
  );
  const coverageSubProvider = new CoverageSubprovider(
    artifactAdapter,
    defaultFromAddress,
    {
      isVerbose: isVerbose,
      ignoreFilesGlobs: ['**/Migrations.sol']
    }
  );

  global.coverageSubProvider = coverageSubProvider;

  testProvider.addProvider(coverageSubProvider);

  testProvider.addProvider(
    new RevertTraceSubprovider(artifactAdapter, defaultFromAddress, isVerbose)
  );

  testProvider.send = testProvider.sendAsync.bind(testProvider);

  return testProvider;
};

/**
 * A config generation helper function
 *
 * @param {string} projectRoot - path to the project using this config
 * @returns {Object} - Config object for truffle
 */
const configHelper = projectRoot => {
  const testProvider = createTestProvider(projectRoot);
  let testProviderStarted = false;

  return {
    networks: {
      development: {
        host: '127.0.0.1',
        port: 7545,
        network_id: '*' // Match any network id
      },
      test: {
        provider: () => {
          if (!testProviderStarted) {
            // Within this function to not start the provider until it's needed
            testProvider.addProvider(
              new WebsocketProvider({ rpcUrl: 'http://localhost:7545' })
            );

            testProvider.start(err => {
              testProviderStarted = true;

              if (err !== undefined) {
                // eslint-disable-next-line no-console
                console.log('Failed to start provider', err);
                process.exit(1);
              }
            });
          }
          return testProvider;
        },
        network_id: '*'
      }
    },
    compilers: {
      solc: {
        version: solcVersion
      }
    }
  };
};

module.exports = configHelper(__dirname);
