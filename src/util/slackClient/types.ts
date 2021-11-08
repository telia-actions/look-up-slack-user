import { UsersLookupByEmailArguments } from '@slack/web-api/dist/methods';

export type InitializeClientOptions = {
  token: string;
};

export type LookUpUserByEmailOptions = UsersLookupByEmailArguments;
