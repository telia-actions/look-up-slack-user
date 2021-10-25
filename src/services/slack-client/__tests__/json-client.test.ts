import { read } from '../json-client';

describe('services json client', () => {
  describe('read', () => {
    const path = './__mocks__/mock-file.json';

    it('should read json file contents', async () => {
      const result = await read(path);

      expect(result).toEqual({ prop1: 'prop1', prop2: 'prop2' });
    });
  });
});
