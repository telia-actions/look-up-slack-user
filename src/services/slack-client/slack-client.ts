import { WebClient } from '@slack/web-api';
import { InitializeClientOptions, LookUpUserByEmailOptions } from './types';

let slackClient: WebClient;

export const initializeClient = (options: InitializeClientOptions) => {
  slackClient = new WebClient(options.token);
};

export const lookUpUserByEmail = (options: LookUpUserByEmailOptions) => {
  return slackClient.users.lookupByEmail(options);
};
