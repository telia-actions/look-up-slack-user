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

export const lookUpUserByEmail = async (options: LookUpUserByEmailOptions) => {
  try {
    return await slackClient.users.lookupByEmail(options);
  } catch (e) {
    return e.data;
  }
};
