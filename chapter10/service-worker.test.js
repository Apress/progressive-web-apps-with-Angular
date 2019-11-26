const makeServiceWorkerEnv = require('service-worker-mock');
const makeFetchMock = require('service-worker-mock/fetch');

describe('Service worker', () => {
  beforeEach(() => {
    Object.assign(
      global,
      makeServiceWorkerEnv(),
      makeFetchMock()
      // If you're using sinon ur similar you'd probably use below instead of makeFetchMock
      // fetch: sinon.stub().returns(Promise.resolve())
    );
    jest.resetModules();
  });

  it('should add listeners', () => {
    require('./service-worker.js');
    expect(self.listeners['install']).toBeDefined();
    expect(self.listeners['activate']).toBeDefined();
    expect(self.listeners['push']).toBeDefined();
    expect(self.listeners['sync']).toBeDefined();
    expect(self.listeners['fetch']).toBeUndefined();
  });

  it('should delete old caches on activate', async () => {
    require('./service-worker.js');
    // Create old cache
    await self.caches.open('OLD_CACHE');
    expect(self.snapshot().caches.OLD_CACHE).toBeDefined();
    // Activate and verify old cache is removed
    await self.trigger('activate');
    expect(self.snapshot().caches.OLD_CACHE).toBeUndefined();
  });
});
