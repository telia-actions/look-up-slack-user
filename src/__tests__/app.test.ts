import * as slackWebApi from '@slack/web-api';
import * as proxyClient from '../util/proxy-client';
import * as slackClient from '../util/slack-client';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { createAppContainer } from '../app';
import { createSlackClient } from '../util/slack-client';
import { mockPartial } from '../util/mocks';

jest.mock('@slack/web-api');
jest.mock('../util/proxy-client');
jest.mock('../util/slack-client');

describe('app ', () => {
  const token = 'token';

  const webClientMock = mockPartial<slackWebApi.WebClient>({
    token,
  });

  const proxyAgentMock = mockPartial<HttpsProxyAgent>({
    maxSockets: 10,
  });

  const slackClientMock = mockPartial<slackClient.SlackClient>({});

  const webClientSpy = jest.spyOn(slackWebApi, 'WebClient');
  const createProxyAgentSpy = jest.spyOn(proxyClient, 'createProxyAgent');
  const createSlackClientSpy = jest.spyOn(slackClient, 'createSlackClient');

  beforeEach(() => {
    webClientSpy.mockReturnValue(webClientMock);
    createProxyAgentSpy.mockReturnValue(proxyAgentMock);
    createSlackClientSpy.mockReturnValue(slackClientMock);
  });

  describe('createAppContainer ', () => {
    it('should initialize services', async () => {
      const result = createAppContainer({ slackToken: token });

      expect(webClientSpy).toHaveBeenCalledTimes(1);
      expect(webClientSpy).toHaveBeenCalledWith(token, { agent: proxyAgentMock });

      expect(createProxyAgentSpy).toHaveBeenCalledTimes(1);

      expect(createSlackClientSpy).toHaveBeenCalledTimes(1);
      expect(createSlackClientSpy).toHaveBeenCalledWith({ slackWebClient: webClientMock });

      expect(result).toEqual({
        slackClient: slackClientMock,
      });
    });
  });
});
