import { initializeClient, lookUpUserByEmail } from '../slackClient';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { mockPartial } from '../../mocks';
import { InitializeClientOptions, LookUpUserByEmailOptions } from '../types';
import * as proxyClient from '../../proxyClient';
import * as slackWebApi from '@slack/web-api';
import { UsersLookupByEmailResponse } from '@slack/web-api/dist/response/UsersLookupByEmailResponse';
import { WebAPIPlatformError } from '@slack/web-api/dist/errors';

jest.mock('@slack/web-api');
jest.mock('../../proxyClient');

describe('utils slack client', () => {
  const token = 'token';
  const createProxyAgentSpy = jest.spyOn(proxyClient, 'createProxyAgent');

  describe('initializeClient', () => {
    const options = mockPartial<InitializeClientOptions>({
      token,
    });

    const agent = mockPartial<HttpsProxyAgent>({
      maxSockets: 10,
    });

    const webClientSpy = jest.spyOn(slackWebApi, 'WebClient');

    beforeEach(() => {
      createProxyAgentSpy.mockReturnValue(agent);
    });

    it('should initialize slack client', () => {
      initializeClient(options);

      expect(createProxyAgentSpy).toHaveBeenCalledTimes(1);

      expect(webClientSpy).toHaveBeenCalledTimes(1);
      expect(webClientSpy).toHaveBeenCalledWith(options.token, { agent });
    });
  });

  describe('lookUpUserByEmail', () => {
    const lookupByEmailMock = jest.fn();

    const webClient = mockPartial<slackWebApi.WebClient>({
      users: {
        lookupByEmail: lookupByEmailMock,
      },
    });
    const webClientSpy = jest.spyOn(slackWebApi, 'WebClient').mockReturnValue(webClient);

    initializeClient({ token });

    const options = mockPartial<LookUpUserByEmailOptions>({
      email: 'email',
    });

    it('should look up user info', async () => {
      const response = mockPartial<UsersLookupByEmailResponse>({
        ok: true,
      });

      lookupByEmailMock.mockResolvedValue(response);

      const result = await lookUpUserByEmail(options);

      expect(result).toBe(response);

      expect(lookupByEmailMock).toHaveBeenCalledTimes(1);
      expect(lookupByEmailMock).toHaveBeenCalledWith(options);
    });

    it('should resolve when user look up fails with "users_not_found" error', async () => {
      const response = mockPartial<WebAPIPlatformError>({
        data: {
          ok: false,
          error: 'users_not_found',
        },
      });

      lookupByEmailMock.mockRejectedValue(response);

      const result = await lookUpUserByEmail(options);

      expect(result).toBe(response.data);

      expect(lookupByEmailMock).toHaveBeenCalledTimes(1);
      expect(lookupByEmailMock).toHaveBeenCalledWith(options);
    });

    it('should reject when user look up fails with error other than"users_not_found"', async () => {
      const response = mockPartial<WebAPIPlatformError>({
        data: {
          ok: false,
          error: 'some_error',
        },
      });

      lookupByEmailMock.mockRejectedValue(response);

      await expect(lookUpUserByEmail(options)).rejects.toBe(response);
    });

    it('should reject when user look up fails with error without data', async () => {
      const response = mockPartial<WebAPIPlatformError>({});

      lookupByEmailMock.mockRejectedValue(response);

      await expect(lookUpUserByEmail(options)).rejects.toBe(response);
    });
  });
});
