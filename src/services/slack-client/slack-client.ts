import { WebClient } from '@slack/web-api';
import createHttpsProxyAgent from 'https-proxy-agent';
import { InitializeClientOptions, LookUpUserByEmailOptions } from './types';

let slackClient: WebClient;

export const initializeClient = (options: InitializeClientOptions) => {
  const { https_proxy } = process.env;

  const agent = https_proxy ? createHttpsProxyAgent(https_proxy) : undefined;

  slackClient = new WebClient(options.token, {
    agent,
  });
};

export const lookUpUserByEmail = (options: LookUpUserByEmailOptions) => {
  return slackClient.users.lookupByEmail(options);
};
