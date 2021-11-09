import { UsersLookupByEmailArguments, WebClient } from '@slack/web-api';

export type SlackClientArgs = {
  slackWebClient: WebClient;
};

export type LookUpUserByEmailOptions = UsersLookupByEmailArguments;
