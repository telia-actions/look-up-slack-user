import { createProxyAgent } from '../proxy-client';
import * as httpsProxyClient from 'https-proxy-agent';
import { mockPartial } from '../../mocks';

jest.mock('https-proxy-agent');

describe('proxy-client', () => {
  describe('read', () => {
    const agent = mockPartial<httpsProxyClient.HttpsProxyAgent>({
      maxSockets: 10,
    });

    const httpsProxyClientSpy = jest.spyOn(httpsProxyClient, 'default');

    beforeEach(() => {
      httpsProxyClientSpy.mockReturnValue(agent);
      process.env = {};
    });

    it('should create proxy agent when https_proxy env var is set', () => {
      process.env.https_proxy = 'https_proxy';

      const result = createProxyAgent();

      expect(httpsProxyClientSpy).toHaveBeenCalledTimes(1);
      expect(httpsProxyClientSpy).toHaveBeenCalledWith(process.env.https_proxy);

      expect(result).toEqual(agent);
    });

    it('should create proxy agent when HTTPS_PROXY env var is set', () => {
      process.env.HTTPS_PROXY = 'HTTPS_PROXY';

      const result = createProxyAgent();

      expect(httpsProxyClientSpy).toHaveBeenCalledTimes(1);
      expect(httpsProxyClientSpy).toHaveBeenCalledWith(process.env.HTTPS_PROXY);

      expect(result).toEqual(agent);
    });

    it('should throw when no proxy env var is set', () => {
      expect(createProxyAgent).toThrow(Error);

      expect(httpsProxyClientSpy).toHaveBeenCalledTimes(0);
    });
  });
});
