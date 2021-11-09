import { WebClient } from '@slack/web-api';
import { createProxyAgent } from './util/proxy-client';
import { createSlackClient } from './util/slack-client';

export type CreateAppConfig = {
  slackToken: string;
};

export const createAppContainer = (config: CreateAppConfig) => {
  const slackWebClient = new WebClient(config.slackToken, {
    agent: createProxyAgent(),
  });

  const slackClient = createSlackClient({ slackWebClient });

  return { slackClient };
};
