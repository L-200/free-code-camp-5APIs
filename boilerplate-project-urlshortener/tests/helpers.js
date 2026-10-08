/**
 * Carrega uma instância NOVA do app a cada chamada (armazenamento zerado)
 * com `dns.lookup` mockado, sem depender de rede.
 *
 * Hosts em `badHosts` falham com ENOTFOUND; os demais resolvem.
 * Cobre tanto `dns.lookup` (callback) quanto `dns.promises.lookup`.
 */
const BAD_HOSTS = ['invalid-host-that-does-not-exist.example'];

function loadApp(badHosts = BAD_HOSTS) {
  jest.resetModules();

  const notFound = (host) => {
    const err = new Error(`getaddrinfo ENOTFOUND ${host}`);
    err.code = 'ENOTFOUND';
    return err;
  };

  const lookup = jest.fn((host, ...args) => {
    const cb = args[args.length - 1];
    if (badHosts.includes(host)) return cb(notFound(host));
    return cb(null, '93.184.216.34', 4);
  });

  const promisesLookup = jest.fn(async (host) => {
    if (badHosts.includes(host)) throw notFound(host);
    return { address: '93.184.216.34', family: 4 };
  });

  jest.doMock('dns', () => ({
    ...jest.requireActual('dns'),
    lookup,
    promises: { lookup: promisesLookup },
  }));

  const app = require('../index');
  return { app, lookup, promisesLookup };
}

module.exports = { loadApp, BAD_HOSTS };
