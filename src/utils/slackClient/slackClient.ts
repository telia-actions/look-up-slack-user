import { WebClient } from '@slack/web-api';
import { createProxyAgent } from '../proxy-client';
import { InitializeClientOptions, LookUpUserByEmailOptions } from './types';

let slackClient: WebClient;

export const initializeClient = (options: InitializeClientOptions) => {
  slackClient = new WebClient(options.token, {
    agent: createProxyAgent(),
  });
};

export const lookUpUserByEmail = async (options: LookUpUserByEmailOptions) => {
  try {
    return await slackClient.users.lookupByEmail(options);
  } catch (e) {
    if (e.data?.error === 'users_not_found') {
      return e.data;
    }

    throw e;
  }
};
